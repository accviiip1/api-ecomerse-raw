# Hướng dẫn cài đặt và sử dụng

## Yêu cầu hệ thống

- Node.js (phiên bản 14.x trở lên)
- MongoDB (phiên bản 4.x trở lên)
- npm hoặc pnpm

## Cài đặt

### 1. Clone dự án

```bash
git clone <repository-url>
cd BE-project-reactjs
```

### 2. Cài đặt các dependencies

Sử dụng npm:

```bash
npm install
```

Hoặc sử dụng pnpm:

```bash
pnpm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ file `.env.example`:

```bash
cp .env.example .env
```

Sau đó, chỉnh sửa file `.env` với các thông tin cấu hình của bạn:

```
# SePay API Configuration
SEPAY_API_KEY=YOUR_SEPAY_API_KEY_HERE

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your_database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3000
```

### 4. Khởi động server

Chế độ phát triển (với nodemon):

```bash
npm run dev
```

Hoặc chế độ production:

```bash
npm start
```

Server sẽ chạy tại `http://localhost:3000` (hoặc port được cấu hình trong file `.env`).

## Sử dụng API

### Tài liệu API

Sau khi khởi động server, bạn có thể truy cập tài liệu API Swagger tại:

```
http://localhost:3000/api-docs
```

### Xác thực

Hầu hết các API đều yêu cầu xác thực. Để sử dụng các API này, bạn cần:

1. Đăng ký tài khoản qua API `/api/v1/register`
2. Đăng nhập qua API `/api/v1/login` để nhận JWT token
3. Sử dụng token nhận được trong header `Authorization` cho các request tiếp theo:

```
Authorization: Bearer <your-jwt-token>
```

### Ví dụ sử dụng API

#### Đăng ký tài khoản

```bash
curl -X POST http://localhost:3000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "password123"}'
```

#### Đăng nhập

```bash
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "password123"}'
```

Kết quả:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "user-id"
}
```

#### Lấy danh sách sản phẩm

```bash
curl -X GET http://localhost:3000/api/v1/product
```

#### Thêm sản phẩm vào giỏ hàng

```bash
curl -X POST http://localhost:3000/api/v1/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "userId": "user-id",
    "productId": "product-id",
    "quantity": 1,
    "size": "M"
  }'
```

## Triển khai

Dự án có thể được triển khai lên các nền tảng như Vercel, Heroku, hoặc bất kỳ dịch vụ hosting nào hỗ trợ Node.js.

### Triển khai lên Vercel

Dự án đã có sẵn file cấu hình `vercel.json` để triển khai lên Vercel. Bạn chỉ cần:

1. Cài đặt Vercel CLI:

```bash
npm install -g vercel
```

2. Đăng nhập vào Vercel:

```bash
vercel login
```

3. Triển khai:

```bash
vercel
```

## Xử lý lỗi thường gặp

### Không kết nối được với MongoDB

- Kiểm tra xem MongoDB đã được cài đặt và đang chạy
- Kiểm tra lại chuỗi kết nối trong file `.env`
- Đảm bảo rằng tường lửa không chặn kết nối đến MongoDB

### Token hết hạn

- Sử dụng API `/api/v1/refresh-token` với refresh token để lấy token mới
- Đảm bảo rằng refresh token vẫn còn hiệu lực (7 ngày kể từ khi đăng nhập)

### Lỗi CORS

- Nếu bạn gọi API từ một domain khác, hãy đảm bảo rằng domain đó được phép trong cấu hình CORS
- Dự án đã cấu hình CORS cho phép tất cả các origin, nhưng bạn có thể muốn hạn chế điều này trong môi trường production
