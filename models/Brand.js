import mongoose from 'mongoose'
import BaseSchema from './Base.js'

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String, default: '' },
})

BrandSchema.add(BaseSchema)

export default mongoose.model('Brand', BrandSchema)


