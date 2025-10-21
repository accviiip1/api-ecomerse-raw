# Luồng hoạt động chi tiết của dự án

## Tổng quan

Dự án E-commerce API cung cấp các chức năng cơ bản của một website thương mại điện tử, bao gồm quản lý người dùng, sản phẩm, giỏ hàng, đơn hàng và thanh toán. Dưới đây là mô tả chi tiết về luồng hoạt động của từng chức năng.

## 1. Quản lý người dùng

### Đăng ký tài khoản

1. Người dùng gửi request POST đến `/api/v1/register` với thông tin username và password
2. Server kiểm tra tính hợp lệ của dữ liệu
3. Server kiểm tra xem username đã tồn tại chưa
4. Nếu username chưa tồn tại, server mã hóa password bằng bcrypt
5. Server tạo mới user trong cơ sở dữ liệu
6. Server trả về thông báo thành công

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  POST /api/v1/register                     │
     │  {username, password}                      │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Kiểm tra tính hợp lệ
     │                                            │  Kiểm tra username tồn tại
     │                                            │  Mã hóa password
     │                                            │  Lưu vào cơ sở dữ liệu
     │                                            │
     │  201 Created                               │
     │  {message: "User created successfully"}    │
     │ <───────────────────────────────────────── │
     │                                            │
```

### Đăng nhập

1. Người dùng gửi request POST đến `/api/v1/login` với thông tin username và password
2. Server kiểm tra tính hợp lệ của dữ liệu
3. Server tìm user theo username
4. Server so sánh password đã mã hóa
5. Nếu password khớp, server tạo JWT token và refresh token
6. Server trả về token, refresh token và userId

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  POST /api/v1/login                        │
     │  {username, password}                      │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Tìm user theo username
     │                                            │  So sánh password
     │                                            │  Tạo JWT token và refresh token
     │                                            │
     │  200 OK                                    │
     │  {token, refreshToken, id}                 │
     │ <───────────────────────────────────────── │
     │                                            │
```

### Làm mới token

1. Người dùng gửi request POST đến `/api/v1/refresh-token` với refresh token
2. Server kiểm tra tính hợp lệ của refresh token
3. Server tạo JWT token mới
4. Server trả về token mới

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  POST /api/v1/refresh-token                │
     │  {token: refreshToken}                     │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Kiểm tra refresh token
     │                                            │  Tạo JWT token mới
     │                                            │
     │  200 OK                                    │
     │  {accessToken}                             │
     │ <───────────────────────────────────────── │
     │                                            │
```

## 2. Quản lý sản phẩm

### Lấy danh sách sản phẩm

1. Người dùng gửi request GET đến `/api/v1/product` với các tham số tùy chọn (sortType, page, limit)
2. Server truy vấn cơ sở dữ liệu để lấy danh sách sản phẩm theo điều kiện
3. Server trả về danh sách sản phẩm, tổng số sản phẩm và thông tin phân trang

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  GET /api/v1/product?sortType=4&page=1&limit=10
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Truy vấn cơ sở dữ liệu
     │                                            │  Sắp xếp và phân trang
     │                                            │
     │  200 OK                                    │
     │  {contents, total, page, limit}            │
     │ <───────────────────────────────────────── │
     │                                            │
```

### Lấy chi tiết sản phẩm

1. Người dùng gửi request GET đến `/api/v1/product/:productId`
2. Server truy vấn cơ sở dữ liệu để lấy thông tin chi tiết của sản phẩm
3. Server trả về thông tin chi tiết của sản phẩm

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  GET /api/v1/product/123456789             │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Truy vấn cơ sở dữ liệu
     │                                            │
     │  200 OK                                    │
     │  {product}                                 │
     │ <───────────────────────────────────────── │
     │                                            │
```

### Lấy sản phẩm liên quan

1. Người dùng gửi request GET đến `/api/v1/related-products/:productId`
2. Server truy vấn cơ sở dữ liệu để lấy thông tin sản phẩm hiện tại
3. Server truy vấn cơ sở dữ liệu để lấy danh sách sản phẩm cùng loại
4. Server trả về danh sách sản phẩm liên quan

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  GET /api/v1/related-products/123456789    │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Truy vấn sản phẩm hiện tại
     │                                            │  Truy vấn sản phẩm cùng loại
     │                                            │
     │  200 OK                                    │
     │  {relatedProducts}                         │
     │ <───────────────────────────────────────── │
     │                                            │
```

## 3. Quản lý giỏ hàng

### Lấy giỏ hàng

1. Người dùng gửi request GET đến `/api/v1/cart/:userId` với JWT token
2. Server xác thực token
3. Server truy vấn cơ sở dữ liệu để lấy danh sách sản phẩm trong giỏ hàng
4. Server truy vấn thông tin chi tiết của từng sản phẩm
5. Server trả về danh sách sản phẩm trong giỏ hàng với thông tin chi tiết

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  GET /api/v1/cart/123456789                │
     │  Authorization: Bearer <token>             │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Xác thực token
     │                                            │  Truy vấn giỏ hàng
     │                                            │  Truy vấn thông tin sản phẩm
     │                                            │
     │  200 OK                                    │
     │  {msg, data}                               │
     │ <───────────────────────────────────────── │
     │                                            │
```

### Thêm vào giỏ hàng

1. Người dùng gửi request POST đến `/api/v1/cart` với thông tin sản phẩm và JWT token
2. Server xác thực token
3. Server kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
4. Nếu đã có, server cập nhật số lượng
5. Nếu chưa có, server tạo mới item trong giỏ hàng
6. Server trả về thông báo thành công

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  POST /api/v1/cart                         │
     │  Authorization: Bearer <token>             │
     │  {userId, productId, quantity, size}       │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Xác thực token
     │                                            │  Kiểm tra sản phẩm trong giỏ hàng
     │                                            │  Cập nhật hoặc tạo mới
     │                                            │
     │  201 Created                               │
     │  {msg: "Add to cart successfully"}         │
     │ <───────────────────────────────────────── │
     │                                            │
```

## 4. Quản lý đơn hàng

### Tạo đơn hàng

1. Người dùng gửi request POST đến `/api/v1/orders` với thông tin giao hàng và JWT token
2. Server xác thực token
3. Server kiểm tra tính hợp lệ của dữ liệu
4. Server truy vấn giỏ hàng của người dùng
5. Server tính tổng tiền đơn hàng
6. Server tạo đơn hàng mới
7. Server cập nhật trạng thái giỏ hàng (soft delete)
8. Server trả về thông tin đơn hàng đã tạo

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  POST /api/v1/orders                       │
     │  Authorization: Bearer <token>             │
     │  {firstName, lastName, ...}                │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Xác thực token
     │                                            │  Kiểm tra dữ liệu
     │                                            │  Truy vấn giỏ hàng
     │                                            │  Tính tổng tiền
     │                                            │  Tạo đơn hàng
     │                                            │  Cập nhật giỏ hàng
     │                                            │
     │  201 Created                               │
     │  {success, message, data}                  │
     │ <───────────────────────────────────────── │
     │                                            │
```

### Lấy danh sách đơn hàng

1. Người dùng gửi request GET đến `/api/v1/orders` với JWT token
2. Server xác thực token
3. Server truy vấn cơ sở dữ liệu để lấy danh sách đơn hàng của người dùng
4. Server trả về danh sách đơn hàng

```
┌─────────┐                                  ┌─────────┐
│  Client │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  GET /api/v1/orders                        │
     │  Authorization: Bearer <token>             │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Xác thực token
     │                                            │  Truy vấn đơn hàng
     │                                            │
     │  200 OK                                    │
     │  {success, data}                           │
     │ <───────────────────────────────────────── │
     │                                            │
```

## 5. Thanh toán

### Webhook SePay

1. Cổng thanh toán SePay gửi webhook callback đến `/api/v1/payment/sepay-callback` với thông tin giao dịch
2. Server xác thực API key
3. Server kiểm tra loại giao dịch (chỉ xử lý giao dịch tiền vào)
4. Server tìm đơn hàng dựa vào mã đơn hàng trong nội dung chuyển khoản
5. Server kiểm tra số tiền thanh toán
6. Server cập nhật trạng thái đơn hàng và thông tin thanh toán
7. Server trả về thông báo thành công

```
┌─────────┐                                  ┌─────────┐
│  SePay   │                                  │  Server │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  POST /api/v1/payment/sepay-callback       │
     │  Authorization: Apikey <api_key>           │
     │  {id, gateway, transactionDate, ...}       │
     │ ─────────────────────────────────────────> │
     │                                            │
     │                                            │  Xác thực API key
     │                                            │  Kiểm tra loại giao dịch
     │                                            │  Tìm đơn hàng
     │                                            │  Kiểm tra số tiền
     │                                            │  Cập nhật trạng thái đơn hàng
     │                                            │
     │  200 OK                                    │
     │  {success, message, data}                  │
     │ <───────────────────────────────────────── │
     │                                            │
```

## Luồng hoạt động tổng thể

Dưới đây là luồng hoạt động tổng thể của dự án, từ khi người dùng đăng ký tài khoản đến khi hoàn tất đơn hàng:

1. **Đăng ký và đăng nhập**

   - Người dùng đăng ký tài khoản
   - Người dùng đăng nhập và nhận JWT token

2. **Xem và chọn sản phẩm**

   - Người dùng xem danh sách sản phẩm
   - Người dùng xem chi tiết sản phẩm
   - Người dùng xem sản phẩm liên quan

3. **Quản lý giỏ hàng**

   - Người dùng thêm sản phẩm vào giỏ hàng
   - Người dùng xem giỏ hàng
   - Người dùng cập nhật số lượng sản phẩm
   - Người dùng xóa sản phẩm khỏi giỏ hàng

4. **Đặt hàng**

   - Người dùng tạo đơn hàng từ giỏ hàng
   - Hệ thống tạo đơn hàng và xóa giỏ hàng

5. **Thanh toán**

   - Người dùng thanh toán qua ngân hàng
   - Cổng thanh toán SePay gửi webhook callback
   - Hệ thống cập nhật trạng thái đơn hàng

6. **Xem đơn hàng**
   - Người dùng xem danh sách đơn hàng
   - Người dùng xem chi tiết đơn hàng

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Đăng ký/   │     │  Xem danh   │     │  Thêm vào   │     │  Tạo đơn    │
│  Đăng nhập  │────▶│  sách sản   │────▶│  giỏ hàng   │────▶│  hàng       │
└─────────────┘     │  phẩm       │     └─────────────┘     └─────────────┘
                    └─────────────┘                                │
                                                                   │
                                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Cập nhật   │     │  Xử lý      │     │  Webhook    │     │  Thanh toán  │
│  trạng thái │◀────│  thanh toán │◀────│  SePay      │◀────│  đơn hàng   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```
