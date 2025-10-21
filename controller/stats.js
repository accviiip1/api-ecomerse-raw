import Product from '../models/Product.js'
import Order from '../models/Order.js'
import User from '../models/User.js'

export const getAdminStats = async (req, res) => {
  try {
    const [totalProducts, totalUsers, totalOrders] = await Promise.all([
      Product.countDocuments({ deletedAt: null }),
      User.countDocuments({}),
      Order.countDocuments({ deletedAt: null }),
    ])

    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0)
    const startOfMonth = new Date();
    startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0)

    const [revenueTodayAgg, revenueMonthAgg, recentOrders, statusCountsAgg, newCustomersAgg, topSellingAgg, lowStock, revenueByDayAgg] = await Promise.all([
      Order.aggregate([
        { $match: { deletedAt: null, createdAt: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { deletedAt: null, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(10),
      Order.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: startOfToday } } },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { deletedAt: null } },
        { $unwind: '$items' },
        { $group: { _id: '$items.productId', qty: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } } } },
        { $sort: { qty: -1 } },
        { $limit: 5 },
      ]),
      Product.find({ deletedAt: null }).limit(100),
      Order.aggregate([
        { $match: { deletedAt: null, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: { $dayOfMonth: '$createdAt' }, total: { $sum: '$totalAmount' } } },
        { $sort: { '_id': 1 } },
      ]),
    ])

    const revenueToday = revenueTodayAgg?.[0]?.total || 0
    const revenueMonth = revenueMonthAgg?.[0]?.total || 0
    const statusCounts = statusCountsAgg.reduce((acc, it) => { acc[it._id] = it.count; return acc }, {})
    const newCustomers = newCustomersAgg?.[0]?.count || 0
    const lowStockProducts = lowStock.filter((p) => Array.isArray(p.size) && p.size.reduce((s, it)=> s + (Number(it?.stock||0)), 0) <= 5)

    // build daily revenue array for current month
    const daysInMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).getDate()
    const revenueByDay = Array.from({ length: daysInMonth }, (_, i) => {
      const found = revenueByDayAgg.find((d) => d._id === i + 1)
      return found ? found.total : 0
    })

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      revenueToday,
      revenueMonth,
      recentOrders,
      statusCounts,
      newCustomers,
      topSelling: topSellingAgg,
      lowStock: lowStockProducts.map((p)=>({ id: p._id, name: p.name })),
      revenueByDay,
    })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}


