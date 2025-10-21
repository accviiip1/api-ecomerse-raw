# Cấu trúc dự án

## Tổng quan về cấu trúc thư mục

```
BE-project-reactjs/
├── controller/         # Xử lý logic nghiệp vụ
│   ├── cart.js         # Xử lý giỏ hàng
│   ├── order.js        # Xử lý đơn hàng
│   ├── payment.js      # Xử lý thanh toán
│   ├── product.js      # Xử lý sản phẩm
│   └── user.js         # Xử lý thông tin người dùng
│
├── middleware/         # Middleware xác thực và xử lý lỗi
│   └── middleware.js   # Middleware xác thực JWT
│
├── models/             # Định nghĩa schema MongoDB
│   ├── Auth.js         # Model xác thực
│   ├── Base.js         # Schema cơ sở cho tất cả các model
│   ├── Cart.js         # Model giỏ hàng
│   ├── Order.js        # Model đơn hàng
│   ├── Product.js      # Model sản phẩm
│   └── User.js         # Model người dùng
│
├── routers/            # Định tuyến API
│   ├── auth.js         # Route xác thực
│   ├── cart.js         # Route giỏ hàng
│   ├── index.js        # Tổng hợp các route
│   ├── order.js        # Route đơn hàng
│   ├── payment.js      # Route thanh toán
│   ├── products.js     # Route sản phẩm
│   └── user.js         # Route người dùng
│
├── .env.example        # Mẫu file cấu hình môi trường
├── db.js               # Kết nối cơ sở dữ liệu
├── index.js            # Điểm khởi đầu ứng dụng
├── package.json        # Cấu hình dự án và dependencies
├── swagger.js          # Cấu hình Swagger
└── swagger.json        # Tài liệu API Swagger
```

## Chi tiết các thành phần

### 1. Controller

Chứa logic xử lý nghiệp vụ cho từng tính năng của ứng dụng.

- **cart.js**: Xử lý các thao tác với giỏ hàng (thêm, xóa, cập nhật)
- **order.js**: Xử lý đơn hàng (tạo, xem, cập nhật)
- **payment.js**: Xử lý thanh toán và webhook từ cổng thanh toán
- **product.js**: Xử lý sản phẩm (tạo, xem, tìm kiếm)
- **user.js**: Xử lý thông tin người dùng

### 2. Middleware

Chứa các middleware được sử dụng trong ứng dụng.

- **middleware.js**: Middleware xác thực JWT, kiểm tra token và lấy thông tin người dùng

### 3. Models

Định nghĩa cấu trúc dữ liệu và schema cho MongoDB.

- **Auth.js**: Model xác thực người dùng
- **Base.js**: Schema cơ sở với các trường chung cho tất cả các model (id, createdAt, updatedAt, deletedAt)
- **Cart.js**: Model giỏ hàng, lưu thông tin sản phẩm trong giỏ hàng của người dùng
- **Order.js**: Model đơn hàng, lưu thông tin đơn hàng và trạng thái
- **Product.js**: Model sản phẩm, lưu thông tin chi tiết sản phẩm
- **User.js**: Model người dùng, lưu thông tin tài khoản

### 4. Routers

Định nghĩa các endpoint API và kết nối với controller tương ứng.

- **auth.js**: Các route xác thực (đăng ký, đăng nhập, làm mới token)
- **cart.js**: Các route giỏ hàng
- **index.js**: Tổng hợp và export tất cả các router
- **order.js**: Các route đơn hàng
- **payment.js**: Các route thanh toán
- **products.js**: Các route sản phẩm
- **user.js**: Các route người dùng

### 5. File cấu hình

- **.env.example**: Mẫu file cấu hình môi trường
- **db.js**: Cấu hình và kết nối đến MongoDB
- **index.js**: File chính khởi động ứng dụng, cấu hình middleware và route
- **package.json**: Cấu hình dự án và dependencies
- **swagger.js**: Cấu hình Swagger cho tài liệu API
- **swagger.json**: Định nghĩa API theo chuẩn OpenAPI

## Luồng xử lý request

1. Request đến server qua `index.js`
2. Middleware xử lý request (CORS, JSON parsing, helmet security)
3. Router định tuyến request đến controller tương ứng
4. Middleware xác thực kiểm tra token nếu cần
5. Controller xử lý logic nghiệp vụ
6. Model tương tác với cơ sở dữ liệu
7. Controller trả về response

## Mô hình dữ liệu

### User

- \_id: String (UUID)
- username: String
- password: String (đã mã hóa)
- createdAt: Date
- updatedAt: Date
- deletedAt: Date

### Product

- \_id: String (UUID)
- name: String
- price: Number
- description: String
- type: String
- size: Array of Objects
- material: String
- images: Array of Strings
- createdAt: Date
- updatedAt: Date
- deletedAt: Date

### Cart

- \_id: String (UUID)
- userId: String
- productId: String
- quantity: Number
- size: String
- createdAt: Date
- updatedAt: Date
- deletedAt: Date

### Order

- \_id: String (UUID)
- userId: String
- firstName: String
- lastName: String
- companyName: String
- country: String
- street: String
- apartment: String
- cities: String
- state: String
- phone: String
- zipCode: String
- email: String
- status: String (pending, processing, shipped, delivered, cancelled)
- items: Array of Objects (productId, quantity, size, price)
- totalAmount: Number
- paymentInfo: Object
- createdAt: Date
- updatedAt: Date
- deletedAt: Date
