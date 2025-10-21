# Tổng quan về dự án E-commerce API

## Giới thiệu

Đây là một RESTful API được xây dựng cho website thương mại điện tử, cung cấp các chức năng cơ bản như quản lý người dùng, sản phẩm, giỏ hàng, đơn hàng và thanh toán. API được phát triển bằng Node.js, Express và MongoDB.

## Công nghệ sử dụng

- **Node.js**: Môi trường runtime JavaScript
- **Express**: Framework web cho Node.js
- **MongoDB**: Cơ sở dữ liệu NoSQL
- **Mongoose**: ODM (Object Data Modeling) cho MongoDB
- **JWT**: JSON Web Token cho xác thực người dùng
- **Bcrypt**: Mã hóa mật khẩu
- **Swagger**: Tài liệu API

## Cấu trúc dự án

```
BE-project-reactjs/
├── controller/         # Xử lý logic nghiệp vụ
├── middleware/         # Middleware xác thực và xử lý lỗi
├── models/             # Định nghĩa schema MongoDB
├── routers/            # Định tuyến API
├── .env.example        # Mẫu file cấu hình môi trường
├── db.js               # Kết nối cơ sở dữ liệu
├── index.js            # Điểm khởi đầu ứng dụng
├── package.json        # Cấu hình dự án và dependencies
├── swagger.js          # Cấu hình Swagger
└── swagger.json        # Tài liệu API Swagger
```

## Luồng hoạt động của dự án

### 1. Xác thực người dùng

- Người dùng đăng ký tài khoản với username và password
- Mật khẩu được mã hóa bằng bcrypt trước khi lưu vào cơ sở dữ liệu
- Khi đăng nhập, người dùng nhận được JWT token để sử dụng cho các yêu cầu tiếp theo
- Token có thời hạn 5 phút, refresh token có thời hạn 7 ngày

### 2. Quản lý sản phẩm

- Xem danh sách sản phẩm với các tùy chọn sắp xếp và phân trang
- Xem chi tiết sản phẩm
- Xem các sản phẩm liên quan (cùng loại)
- Thêm sản phẩm mới (yêu cầu quyền admin)

### 3. Quản lý giỏ hàng

- Thêm sản phẩm vào giỏ hàng
- Xem giỏ hàng
- Giảm số lượng sản phẩm trong giỏ hàng
- Xóa sản phẩm khỏi giỏ hàng
- Xóa toàn bộ giỏ hàng

### 4. Quản lý đơn hàng

- Tạo đơn hàng mới từ giỏ hàng
- Xem danh sách đơn hàng của người dùng
- Xem chi tiết đơn hàng

### 5. Thanh toán

- Xử lý webhook callback từ cổng thanh toán SePay
- Cập nhật trạng thái đơn hàng sau khi thanh toán thành công

## Các chức năng chính

1. **Quản lý người dùng**

   - Đăng ký
   - Đăng nhập
   - Làm mới token

2. **Quản lý sản phẩm**

   - Xem danh sách sản phẩm
   - Xem chi tiết sản phẩm
   - Xem sản phẩm liên quan
   - Thêm sản phẩm mới

3. **Quản lý giỏ hàng**

   - Thêm vào giỏ hàng
   - Xem giỏ hàng
   - Giảm số lượng
   - Xóa sản phẩm
   - Xóa toàn bộ giỏ hàng

4. **Quản lý đơn hàng**

   - Tạo đơn hàng
   - Xem danh sách đơn hàng
   - Xem chi tiết đơn hàng

5. **Thanh toán**
   - Xử lý webhook từ SePay
