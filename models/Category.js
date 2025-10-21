import mongoose from 'mongoose'
import BaseSchema from './Base.js'

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parentId: { type: String, default: null },
})

CategorySchema.add(BaseSchema)

export default mongoose.model('Category', CategorySchema)


