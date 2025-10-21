import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy từ middleware authentication
    const {
      firstName,
      lastName,
      companyName,
      country,
      street,
      apartment,
      cities,
      state,
      phone,
      zipCode,
      email,
      // Optional fields from FE for coupon and payment
      couponCode,
      couponId,
      discountAmount: discountAmountRaw,
      finalTotal: finalTotalRaw,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !country ||
      !street ||
      !cities ||
      !state ||
      !phone ||
      !zipCode ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      });
    }

    // Lấy tất cả items trong cart của user
    const cartItems = await Cart.find({ userId, deletedAt: null });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống',
      });
    }

    // Tính tổng tiền và chuẩn bị items cho order
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
      // Lấy thông tin sản phẩm để tính giá
      const product = await Product.findOne({
        _id: cartItem.productId,
        deletedAt: null,
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm với ID ${cartItem.productId} không tồn tại`,
        });
      }

      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        size: cartItem.size,
        price: product.price,
      });
    }

    // Tính discount và final amount
    const discountAmount = Math.max(0, Number(discountAmountRaw) || 0);
    const computedFinalAmount = Math.max(0, totalAmount - discountAmount);
    const finalAmount = Number(finalTotalRaw) || computedFinalAmount;

    // Tạo order mới
    const newOrder = new Order({
      userId,
      user: req.user._id,
      firstName,
      lastName,
      companyName: companyName || '',
      country,
      street,
      apartment: apartment || '',
      cities,
      state,
      phone,
      zipCode,
      email,
      status: 'pending',
      items: orderItems,
      totalAmount,
      finalAmount,
      coupon: {
        code: couponCode || null,
        couponId: couponId || null,
        discountAmount,
        validatedAt: couponCode ? new Date() : null,
      },
      paymentMethod: paymentMethod || null,
    });

    const savedOrder = await newOrder.save();

    // Xóa items khỏi cart sau khi tạo order thành công
    await Cart.updateMany(
      { userId, deletedAt: null },
      { deletedAt: new Date() }
    );

    // compat: add totalPrice alias and orderStatus mirror of status
    const compat = {
      ...savedOrder.toObject(),
      totalPrice: savedOrder.totalAmount,
      finalTotal: savedOrder.finalAmount,
      orderStatus: savedOrder.status,
    }
    res.status(201).json({
      success: true,
      message: 'Đơn hàng đã được tạo thành công',
      data: compat,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo đơn hàng',
      error: error.message,
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId, deletedAt: null }).sort({
      createdAt: -1,
    });

    const compat = orders.map((o) => ({
      ...o.toObject(),
      totalPrice: o.totalAmount,
      orderStatus: o.status,
    }))

    res.status(200).json({
      success: true,
      data: compat,
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách đơn hàng',
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId,
      deletedAt: null,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    const compat = {
      ...order.toObject(),
      totalPrice: order.totalAmount,
      orderStatus: order.status,
    }
    res.status(200).json({
      success: true,
      data: compat,
    });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin đơn hàng',
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, orderStatus, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (orderStatus) update.status = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (!Object.keys(update).length) {
      return res.status(400).json({ success: false, message: 'No update fields provided' });
    }
    update.updatedAt = new Date();
    const updated = await Order.findByIdAndUpdate(orderId, { $set: update }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    const compat = {
      ...updated.toObject(),
      totalPrice: updated.totalAmount,
      orderStatus: updated.status,
    };
    res.status(200).json({ success: true, data: compat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trạng thái', error: error.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    const [items, total] = await Promise.all([
      Order.find(filter)
        .sort(sort || '-_id')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    const compat = items.map((o) => ({
      ...o.toObject(),
      totalPrice: o.totalAmount,
      orderStatus: o.status,
    }));

    res.status(200).json({ success: true, data: compat, page: Number(page), limit: Number(limit), total });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách đơn hàng', error: error.message });
  }
};
