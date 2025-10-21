# Controllers Directory

## 📋 Tổng quan
Thư mục chứa các controller xử lý logic nghiệp vụ và giao tiếp với database.

## 📁 Cấu trúc thư mục

### `user.js`
**Chức năng**: Controller quản lý người dùng

**Functions**:
- `getInfoUser(req, res)` - Lấy thông tin user theo ID
- `listUsers(req, res)` - Lấy danh sách users (Admin)
- `toggleActive(req, res)` - Bật/tắt trạng thái user (Admin)
- `getUserProfile(req, res)` - Lấy profile user hiện tại
- `updateUserProfile(req, res)` - Cập nhật profile user
- `changePassword(req, res)` - Đổi mật khẩu user
- `uploadAvatar(req, res)` - Upload avatar user

**Sử dụng**:
```javascript
// Lấy thông tin user
app.get('/api/v1/user/info/:userId', authMiddleware, getInfoUser)

// Lấy danh sách users
app.get('/api/v1/users', authMiddleware, listUsers)

// Cập nhật profile
app.put('/api/v1/user/profile', authMiddleware, updateUserProfile)
```

### `setting.js`
**Chức năng**: Controller quản lý cài đặt hệ thống

**Functions**:
- `getSetting(req, res)` - Lấy cài đặt hệ thống
- `upsertSetting(req, res)` - Cập nhật cài đặt hệ thống

**Sử dụng**:
```javascript
// Lấy cài đặt
app.get('/api/v1/settings', getSetting)

// Cập nhật cài đặt
app.put('/api/v1/settings', authMiddleware, upsertSetting)
```

## 🔧 Controller Patterns

### Standard Response Format
```javascript
// Success response
res.json({
  success: true,
  message: 'Operation successful',
  data: result
})

// Error response
res.status(400).json({
  success: false,
  message: 'Error message',
  error: errorDetails
})
```

### Error Handling
```javascript
const controllerFunction = async (req, res) => {
  try {
    // Business logic
    const result = await someOperation()
    
    res.json({
      success: true,
      message: 'Success',
      data: result
    })
  } catch (error) {
    console.error('Controller error:', error)
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error : {}
    })
  }
}
```

### Authentication Middleware
```javascript
// Sử dụng authMiddleware
app.get('/protected-route', authMiddleware, (req, res) => {
  // req.user chứa thông tin user đã authenticate
  res.json({ user: req.user })
})
```

## 🚀 Best Practices

### Input Validation
```javascript
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body
    
    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      })
    }
    
    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }
    
    // Continue with business logic...
  } catch (error) {
    // Error handling
  }
}
```

### Database Operations
```javascript
const getUserProfile = async (req, res) => {
  try {
    const user = req.user
    
    // Prepare response data
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      avatar: user.avatar || '',
      role: user.role || 'user',
      isActive: user.isActive
    }
    
    res.json(userData)
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ message: error.message })
  }
}
```

### Password Security
```javascript
const changePassword = async (req, res) => {
  try {
    const user = req.user
    const { currentPassword, newPassword } = req.body
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Current password is incorrect' 
      })
    }
    
    // Update password
    user.password = newPassword
    await user.save()
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: error.message })
  }
}
```

## 📊 Response Examples

### Success Response
```javascript
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "user-id",
    "username": "hung.nguyen",
    "email": "hung@example.com",
    "firstName": "Hùng",
    "lastName": "Nguyễn"
  }
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

## 🔒 Security Features

### Authentication
```javascript
// Middleware kiểm tra token
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' })
  }
}
```

### Input Sanitization
```javascript
const sanitizeInput = (data) => {
  const sanitized = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim()
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}
```

## 🧪 Testing
```javascript
describe('User Controller', () => {
  test('should get user profile', async () => {
    const mockUser = {
      _id: 'user-id',
      username: 'testuser',
      email: 'test@example.com'
    }
    
    req.user = mockUser
    
    await getUserProfile(req, res)
    
    expect(res.json).toHaveBeenCalledWith({
      _id: 'user-id',
      username: 'testuser',
      email: 'test@example.com'
    })
  })
})
```

## 📚 Complete Example

### User Controller
```javascript
import User from '../models/User.js'

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      avatar: user.avatar || '',
      role: user.role || 'user',
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    res.json(userData)
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { firstName, lastName, phone, address, dateOfBirth, gender, email } = req.body

    // Update user fields
    if (firstName !== undefined) user.firstName = firstName
    if (lastName !== undefined) user.lastName = lastName
    if (phone !== undefined) user.phone = phone
    if (address !== undefined) user.address = address
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth
    if (gender !== undefined) user.gender = gender
    if (email !== undefined) user.email = email

    await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Update user profile error:', error)
    res.status(500).json({ message: error.message })
  }
}
```
