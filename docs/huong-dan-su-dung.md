# Hướng dẫn sử dụng chi tiết

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Cài đặt và cấu hình](#cài-đặt-và-cấu-hình)
3. [Quản lý người dùng](#quản-lý-người-dùng)
4. [Quản lý sản phẩm](#quản-lý-sản-phẩm)
5. [Quản lý giỏ hàng](#quản-lý-giỏ-hàng)
6. [Quản lý đơn hàng](#quản-lý-đơn-hàng)
7. [Thanh toán](#thanh-toán)
8. [Bảo mật](#bảo-mật)
9. [Xử lý lỗi](#xử-lý-lỗi)
10. [Mở rộng](#mở-rộng)

## Giới thiệu

API E-commerce này được xây dựng để hỗ trợ các chức năng cơ bản của một website thương mại điện tử, bao gồm quản lý người dùng, sản phẩm, giỏ hàng, đơn hàng và thanh toán.

API được thiết kế theo kiến trúc RESTful, sử dụng JWT để xác thực và bảo mật.

## Cài đặt và cấu hình

### Yêu cầu hệ thống

- Node.js (phiên bản 14.x trở lên)
- MongoDB (phiên bản 4.x trở lên)
- npm hoặc pnpm

### Cài đặt

1. Clone dự án:

```bash
git clone <repository-url>
cd BE-project-reactjs
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
pnpm install
```

3. Cấu hình môi trường:

   - Tạo file `.env` từ file `.env.example`
   - Cập nhật các thông số cấu hình:
     - `MONGODB_URI`: URL kết nối MongoDB
     - `JWT_SECRET`: Khóa bí mật cho JWT
     - `PORT`: Cổng server (mặc định: 3000)
     - `SEPAY_API_KEY`: API key cho cổng thanh toán SePay

4. Khởi động server:

```bash
# Chế độ phát triển
npm run dev

# Chế độ production
npm start
```

## Quản lý người dùng

### Đăng ký tài khoản

Để đăng ký tài khoản mới, gửi request POST đến `/api/v1/register` với thông tin username và password:

```javascript
// Ví dụ sử dụng fetch API
fetch('http://localhost:3000/api/v1/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'user1',
    password: 'password123',
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Đăng nhập

Để đăng nhập và nhận JWT token, gửi request POST đến `/api/v1/login`:

```javascript
fetch('http://localhost:3000/api/v1/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'user1',
    password: 'password123',
  }),
})
  .then((response) => response.json())
  .then((data) => {
    // Lưu token vào localStorage hoặc cookie
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', data.id);
  });
```

### Làm mới token

Khi token hết hạn (sau 5 phút), bạn có thể sử dụng refresh token để lấy token mới:

```javascript
fetch('http://localhost:3000/api/v1/refresh-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: localStorage.getItem('refreshToken'),
  }),
})
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem('token', data.accessToken);
  });
```

### Lấy thông tin người dùng

Để lấy thông tin chi tiết của người dùng, gửi request GET đến `/api/v1/user/info/:userId`:

```javascript
fetch(
  `http://localhost:3000/api/v1/user/info/${localStorage.getItem('userId')}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
)
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Quản lý sản phẩm

### Lấy danh sách sản phẩm

Để lấy danh sách sản phẩm, gửi request GET đến `/api/v1/product`:

```javascript
// Lấy tất cả sản phẩm
fetch('http://localhost:3000/api/v1/product')
  .then((response) => response.json())
  .then((data) => console.log(data));

// Lấy sản phẩm với phân trang và sắp xếp
fetch('http://localhost:3000/api/v1/product?page=1&limit=10&sortType=4')
  .then((response) => response.json())
  .then((data) => console.log(data));
```

Các tùy chọn sắp xếp:

- `0`: Mặc định (theo thời gian tạo, cũ nhất trước)
- `3`: Sản phẩm mới nhất
- `4`: Giá thấp đến cao
- `5`: Giá cao đến thấp

### Lấy chi tiết sản phẩm

Để lấy thông tin chi tiết của một sản phẩm, gửi request GET đến `/api/v1/product/:productId`:

```javascript
fetch('http://localhost:3000/api/v1/product/123456789')
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Lấy sản phẩm liên quan

Để lấy danh sách sản phẩm liên quan (cùng loại) với sản phẩm hiện tại, gửi request GET đến `/api/v1/related-products/:productId`:

```javascript
fetch('http://localhost:3000/api/v1/related-products/123456789')
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Tạo sản phẩm mới

Để tạo sản phẩm mới, gửi request POST đến `/api/v1/product`:

```javascript
fetch('http://localhost:3000/api/v1/product', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    name: 'Áo thun nam',
    price: 250000,
    description: 'Áo thun nam chất liệu cotton 100%',
    type: 'shirt',
    size: [
      { name: 'S', quantity: 10 },
      { name: 'M', quantity: 15 },
      { name: 'L', quantity: 20 },
    ],
    material: 'cotton',
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Quản lý giỏ hàng

### Lấy giỏ hàng

Để lấy thông tin giỏ hàng của người dùng, gửi request GET đến `/api/v1/cart/:userId`:

```javascript
fetch(`http://localhost:3000/api/v1/cart/${localStorage.getItem('userId')}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Thêm vào giỏ hàng

Để thêm sản phẩm vào giỏ hàng, gửi request POST đến `/api/v1/cart`:

```javascript
fetch('http://localhost:3000/api/v1/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    userId: localStorage.getItem('userId'),
    productId: '123456789',
    quantity: 1,
    size: 'M',
    isMultiple: false, // false: tăng số lượng, true: ghi đè số lượng
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Giảm số lượng trong giỏ hàng

Để giảm số lượng sản phẩm trong giỏ hàng, gửi request POST đến `/api/v1/cart/decrease`:

```javascript
fetch('http://localhost:3000/api/v1/cart/decrease', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    userId: localStorage.getItem('userId'),
    productId: '123456789',
    quantity: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Xóa sản phẩm khỏi giỏ hàng

Để xóa một sản phẩm khỏi giỏ hàng, gửi request DELETE đến `/api/v1/cart/deleteItem`:

```javascript
fetch('http://localhost:3000/api/v1/cart/deleteItem', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    userId: localStorage.getItem('userId'),
    productId: '123456789',
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Xóa toàn bộ giỏ hàng

Để xóa toàn bộ giỏ hàng của người dùng, gửi request DELETE đến `/api/v1/cart/delete`:

```javascript
fetch('http://localhost:3000/api/v1/cart/delete', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    userId: localStorage.getItem('userId'),
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Quản lý đơn hàng

### Tạo đơn hàng

Để tạo đơn hàng mới từ giỏ hàng, gửi request POST đến `/api/v1/orders`:

```javascript
fetch('http://localhost:3000/api/v1/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    companyName: 'Công ty ABC',
    country: 'Vietnam',
    street: 'Đường Hoàng Ngân',
    apartment: 'Số 10',
    cities: 'thanh_pho_ha_noi',
    state: 'huyen_ung_hoa',
    phone: '0366468863',
    zipCode: '10000',
    email: 'nguyenvana@gmail.com',
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Lấy danh sách đơn hàng

Để lấy danh sách đơn hàng của người dùng, gửi request GET đến `/api/v1/orders`:

```javascript
fetch('http://localhost:3000/api/v1/orders', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Lấy chi tiết đơn hàng

Để lấy thông tin chi tiết của một đơn hàng, gửi request GET đến `/api/v1/orders/:orderId`:

```javascript
fetch('http://localhost:3000/api/v1/orders/123456789', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Thanh toán

### Cấu hình SePay

Để sử dụng cổng thanh toán SePay, bạn cần:

1. Đăng ký tài khoản SePay và lấy API key
2. Cấu hình API key trong file `.env`:
   ```
   SEPAY_API_KEY=your_sepay_api_key
   ```

### Webhook SePay

SePay sẽ gửi webhook callback đến endpoint `/api/v1/payment/sepay-callback` khi có giao dịch thanh toán. Webhook này sẽ cập nhật trạng thái đơn hàng dựa trên thông tin thanh toán.

Để xử lý webhook, server cần được triển khai trên một domain công khai hoặc sử dụng dịch vụ như ngrok để tạo tunnel đến localhost trong quá trình phát triển.

## Bảo mật

### JWT Authentication

API sử dụng JWT (JSON Web Token) để xác thực người dùng. Mỗi token có thời hạn 5 phút và refresh token có thời hạn 7 ngày.

Để sử dụng các API yêu cầu xác thực, bạn cần thêm header `Authorization` với giá trị `Bearer <token>` vào request.

### API Key Authentication

Webhook SePay sử dụng API key để xác thực. API key được gửi trong header `Authorization` với giá trị `Apikey <api_key>`.

### Bảo mật CORS và Helmet

API sử dụng middleware CORS để kiểm soát truy cập từ các domain khác và Helmet để bảo vệ khỏi các lỗ hổng bảo mật phổ biến.

## Xử lý lỗi

API trả về các mã lỗi HTTP tiêu chuẩn:

- **200 OK**: Yêu cầu thành công
- **201 Created**: Tạo mới thành công
- **400 Bad Request**: Dữ liệu không hợp lệ
- **401 Unauthorized**: Không có quyền truy cập
- **403 Forbidden**: Không có quyền thực hiện hành động
- **404 Not Found**: Không tìm thấy tài nguyên
- **500 Internal Server Error**: Lỗi server

Mỗi response lỗi đều chứa thông tin chi tiết về lỗi trong phần body.

## Mở rộng

### Thêm tính năng mới

Để thêm tính năng mới, bạn cần:

1. Tạo model trong thư mục `models/` (nếu cần)
2. Tạo controller trong thư mục `controller/`
3. Tạo router trong thư mục `routers/`
4. Cập nhật `routers/index.js` để export router mới
5. Cập nhật `index.js` để sử dụng router mới
6. Cập nhật `swagger.json` để thêm tài liệu API mới

### Tùy chỉnh cấu hình

Bạn có thể tùy chỉnh cấu hình trong file `.env`:

- `PORT`: Cổng server
- `MONGODB_URI`: URL kết nối MongoDB
- `JWT_SECRET`: Khóa bí mật cho JWT
- `SEPAY_API_KEY`: API key cho cổng thanh toán SePay
