import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Category from '../models/Category.js'
import Brand from '../models/Brand.js'
import User from '../models/User.js'

dotenv.config()

const slugify = (str) =>
  String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

async function migrate() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecom'
  await mongoose.connect(mongoUri)
  console.log('Connected to MongoDB')

  // 1) Products: ensure slug, visible default, stock (sum of size[].stock), map legacy categoryId/brandId to new fields if present
  const products = await Product.find({})
  let prodUpdates = []
  for (const p of products) {
    const update = {}
    if (!p.slug) update.slug = slugify(p.name || p._id)
    if (typeof p.visible === 'undefined') update.visible = true
    if (Array.isArray(p.size)) {
      const sum = p.size.reduce((s, it) => s + (Number(it?.stock || 0)), 0)
      if (!Number.isNaN(sum)) update.stock = sum
    }
    if (p.categoryId && !p.category) update.category = p.categoryId
    if (p.brandId && !p.brand) update.brand = p.brandId
    if (Object.keys(update).length) {
      prodUpdates.push({ updateOne: { filter: { _id: p._id }, update: { $set: update } } })
    }
  }
  if (prodUpdates.length) {
    await Product.bulkWrite(prodUpdates)
    console.log(`Products updated: ${prodUpdates.length}`)
  } else {
    console.log('Products: no updates required')
  }

  // 2) Categories: ensure slug
  const categories = await Category.find({})
  let catUpdates = []
  for (const c of categories) {
    if (!c.slug) {
      catUpdates.push({ updateOne: { filter: { _id: c._id }, update: { $set: { slug: slugify(c.name || c._id) } } } })
    }
  }
  if (catUpdates.length) {
    await Category.bulkWrite(catUpdates)
    console.log(`Categories updated: ${catUpdates.length}`)
  } else {
    console.log('Categories: no updates required')
  }

  // 3) Orders: set totalPrice from totalAmount; add orderStatus from status; set paymentStatus from paymentInfo.paidAt
  const orders = await Order.find({})
  let orderUpdates = []
  for (const o of orders) {
    const update = {}
    if (typeof o.totalPrice === 'undefined' && typeof o.totalAmount !== 'undefined') update.totalPrice = o.totalAmount
    if (!o.orderStatus && o.status) update.orderStatus = o.status
    if (!o.paymentStatus) update.paymentStatus = o?.paymentInfo?.paidAt ? 'paid' : 'pending'
    if (Object.keys(update).length) {
      orderUpdates.push({ updateOne: { filter: { _id: o._id }, update: { $set: update } } })
    }
  }
  if (orderUpdates.length) {
    await Order.bulkWrite(orderUpdates)
    console.log(`Orders updated: ${orderUpdates.length}`)
  } else {
    console.log('Orders: no updates required')
  }

  // 4) Users: backfill role/isActive/email from username
  const users = await User.find({})
  let userUpdates = []
  for (const u of users) {
    const update = {}
    if (!u.role) update.role = u.isAdmin ? 'admin' : 'user'
    if (typeof u.isActive === 'undefined') update.isActive = true
    if (!u.email && u.username) update.email = `${u.username}@local.local` // placeholder email
    if (Object.keys(update).length) {
      userUpdates.push({ updateOne: { filter: { _id: u._id }, update: { $set: update } } })
    }
  }
  if (userUpdates.length) {
    await User.bulkWrite(userUpdates)
    console.log(`Users updated: ${userUpdates.length}`)
  } else {
    console.log('Users: no updates required')
  }

  await mongoose.disconnect()
  console.log('Migration completed.')
}

migrate().catch((e)=>{ console.error(e); process.exit(1) })


