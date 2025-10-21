import mongoose from 'mongoose'
import BaseSchema from './Base.js'

const AboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  publishedAt: { type: Date, default: null },
})

AboutSchema.add(BaseSchema)

export default mongoose.model('About', AboutSchema)


