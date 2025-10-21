# Backend E-commerce API

## 📋 Tổng quan
API backend cho hệ thống thương mại điện tử, được xây dựng bằng Node.js, Express.js và MongoDB.

## 🚀 Công nghệ sử dụng
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Swagger** - API documentation

## 📁 Cấu trúc thư mục

### `/models/`
Chứa các Mongoose models:
- **User.js** - Model người dùng
- **Product.js** - Model sản phẩm
- **Order.js** - Model đơn hàng
- **Setting.js** - Model cài đặt hệ thống
- **Base.js** - Base schema chung

### `/controllers/`
Chứa các controller xử lý logic:
- **user.js** - Quản lý người dùng
- **product.js** - Quản lý sản phẩm
- **order.js** - Quản lý đơn hàng
- **setting.js** - Quản lý cài đặt

### `/routers/`
Chứa các route definitions:
- **user.js** - Routes người dùng
- **products.js** - Routes sản phẩm
- **order.js** - Routes đơn hàng
- **setting.js** - Routes cài đặt

### `/middleware/`
Chứa các middleware:
- **middleware.js** - Authentication & authorization

## 🛠️ Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Chạy production server
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập

### Users
- `GET /api/v1/user/profile` - Lấy thông tin user
- `PUT /api/v1/user/profile` - Cập nhật thông tin user
- `PUT /api/v1/user/password` - Đổi mật khẩu
- `POST /api/v1/user/avatar` - Upload avatar

### Products
- `GET /api/v1/products` - Lấy danh sách sản phẩm
- `GET /api/v1/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/v1/products` - Tạo sản phẩm (Admin)
- `PUT /api/v1/products/:id` - Cập nhật sản phẩm (Admin)

### Orders
- `GET /api/v1/orders` - Lấy danh sách đơn hàng
- `POST /api/v1/orders` - Tạo đơn hàng
- `PUT /api/v1/orders/:id` - Cập nhật đơn hàng

### Settings
- `GET /api/v1/settings` - Lấy cài đặt hệ thống
- `PUT /api/v1/settings` - Cập nhật cài đặt (Admin)

## 🔐 Authentication
API sử dụng JWT token cho authentication:
```javascript
// Header
Authorization: Bearer <token>
```

## 📊 Database Schema

### User Schema
```javascript
{
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  dateOfBirth: String,
  gender: String,
  avatar: String,
  role: String,
  isActive: Boolean
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  brand: String,
  images: [String],
  stock: Number,
  isActive: Boolean
}
```

## 🔧 Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/ecom
JWT_SECRET=your-secret-key
PORT=3000
```

## 📚 API Documentation
Swagger documentation available at: `http://localhost:3000/api-docs`

## 🧪 Testing
```bash
# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage
```

## 🚀 Deployment
```bash
# Build cho production
npm run build

# Chạy production
npm start
```

## 🤝 Contributing
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request
