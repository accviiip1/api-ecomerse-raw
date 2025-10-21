# Models Directory

## 📋 Tổng quan
Thư mục chứa các Mongoose models định nghĩa cấu trúc dữ liệu cho MongoDB database.

## 📁 Cấu trúc thư mục

### `User.js`
**Chức năng**: Model quản lý thông tin người dùng

**Schema Fields**:
```javascript
{
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, index: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true }
}
```

**Methods**:
- `comparePassword(password)` - So sánh mật khẩu
- `pre('save')` - Hash password trước khi lưu

**Sử dụng**:
```javascript
import User from '../models/User.js'

// Tạo user mới
const user = new User({
  username: 'hung.nguyen',
  password: 'password123',
  email: 'hung@example.com'
})

// So sánh mật khẩu
const isMatch = await user.comparePassword('password123')
```

### `Setting.js`
**Chức năng**: Model quản lý cài đặt hệ thống và cửa hàng

**Schema Fields**:
```javascript
{
  shopName: { type: String, default: '' },
  logo: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  email: { type: String, default: '' },
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
}
```

**Sử dụng**:
```javascript
import Setting from '../models/Setting.js'

// Lấy cài đặt
const settings = await Setting.findOne({})

// Cập nhật cài đặt
await Setting.findOneAndUpdate({}, updateData, { upsert: true })
```

### `Base.js`
**Chức năng**: Base schema chung cho tất cả models

**Schema Fields**:
```javascript
{
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
}
```

**Pre-save Middleware**:
- Tự động cập nhật `updatedAt` khi save
- Soft delete support với `deletedAt`

**Sử dụng**:
```javascript
import BaseSchema from './Base.js'

const CustomSchema = new mongoose.Schema({
  name: String,
  // ... other fields
})

CustomSchema.add(BaseSchema)
```

## 🔧 Model Patterns

### Schema Definition
```javascript
const Schema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
    unique: true,
    default: '',
    enum: ['value1', 'value2'],
    index: true
  }
}, {
  timestamps: true,
  collection: 'custom_collection'
})
```

### Pre-save Hooks
```javascript
Schema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})
```

### Instance Methods
```javascript
Schema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}
```

### Static Methods
```javascript
Schema.statics.findByEmail = function(email) {
  return this.findOne({ email: email })
}
```

## 🚀 Best Practices

### Validation
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
      },
      message: 'Invalid email format'
    }
  }
})
```

### Indexing
```javascript
// Single field index
userSchema.index({ email: 1 })

// Compound index
userSchema.index({ firstName: 1, lastName: 1 })

// Text index for search
userSchema.index({ title: 'text', content: 'text' })
```

### Virtual Fields
```javascript
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

userSchema.set('toJSON', { virtuals: true })
```

## 🔒 Security

### Password Hashing
```javascript
Schema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})
```

### Data Sanitization
```javascript
Schema.pre('save', function(next) {
  // Sanitize string fields
  if (this.name) {
    this.name = this.name.trim()
  }
  next()
})
```

## 📊 Database Operations

### CRUD Operations
```javascript
// Create
const user = new User(data)
await user.save()

// Read
const user = await User.findById(id)
const users = await User.find({ isActive: true })

// Update
await User.findByIdAndUpdate(id, updateData)

// Delete (Soft delete)
await User.findByIdAndUpdate(id, { deletedAt: new Date() })
```

### Aggregation
```javascript
const stats = await User.aggregate([
  { $match: { isActive: true } },
  { $group: { _id: '$role', count: { $sum: 1 } } }
])
```

## 🧪 Testing
```javascript
describe('User Model', () => {
  test('should create user with hashed password', async () => {
    const userData = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com'
    }
    
    const user = new User(userData)
    await user.save()
    
    expect(user.password).not.toBe('password123')
    expect(await user.comparePassword('password123')).toBe(true)
  })
})
```

## 📚 Examples

### Complete Model Example
```javascript
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import BaseSchema from './Base.js'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

// Add base schema
UserSchema.add(BaseSchema)

// Pre-save middleware
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// Instance methods
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

// Static methods
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

export default mongoose.model('User', UserSchema)
```
