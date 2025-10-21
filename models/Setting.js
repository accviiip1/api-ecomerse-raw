import mongoose from 'mongoose'

const SettingSchema = new mongoose.Schema({
  shopName: { type: String, default: '' },
  logo: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  email: { type: String, default: '' }, // Alias for contactEmail
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  workingHours: { type: String, default: 'Thứ 2 - Thứ 6: 8:00 - 18:00' },
  shippingFee: { type: Number, default: 0 },
  paymentOptions: { type: [String], default: [] },
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  description: { type: String, default: '' },
  website: { type: String, default: '' },
  taxCode: { type: String, default: '' },
  bankInfo: {
    bankName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    accountHolder: { type: String, default: '' }
  }
}, { timestamps: true })

export default mongoose.model('Setting', SettingSchema)


