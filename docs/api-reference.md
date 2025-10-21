# Tài liệu API

## Giới thiệu

API được xây dựng theo chuẩn RESTful, sử dụng các phương thức HTTP (GET, POST, PUT, DELETE) và trả về dữ liệu dưới dạng JSON.

Tất cả các API đều có tiền tố `/api/v1`.

## Xác thực

### Đăng ký tài khoản

- **URL**: `/register`
- **Method**: `POST`
- **Yêu cầu xác thực**: Không
- **Mô tả**: Đăng ký tài khoản mới
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "User created successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "User already exists"
    }
    ```

### Đăng nhập

- **URL**: `/login`
- **Method**: `POST`
- **Yêu cầu xác thực**: Không
- **Mô tả**: Đăng nhập và nhận JWT token
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "token": "string",
      "refreshToken": "string",
      "id": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "User does not exist"
    }
    ```
    hoặc
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

### Làm mới token

- **URL**: `/refresh-token`
- **Method**: `POST`
- **Yêu cầu xác thực**: Không
- **Mô tả**: Làm mới JWT token khi token cũ hết hạn
- **Request Body**:
  ```json
  {
    "token": "string" // Refresh token
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "accessToken": "string"
    }
    ```
  - **403 Forbidden**:
    ```json
    {
      "message": "Invalid or expired refresh token"
    }
    ```

## Sản phẩm

### Lấy danh sách sản phẩm

- **URL**: `/product`
- **Method**: `GET`
- **Yêu cầu xác thực**: Không
- **Mô tả**: Lấy danh sách sản phẩm với các tùy chọn sắp xếp và phân trang
- **Query Parameters**:
  - `sortType` (tùy chọn): Loại sắp xếp
    - `0`: Mặc định (theo thời gian tạo, cũ nhất trước)
    - `3`: Sản phẩm mới nhất
    - `4`: Giá thấp đến cao
    - `5`: Giá cao đến thấp
  - `page` (tùy chọn): Số trang (mặc định là 1)
  - `limit` (tùy chọn): Số sản phẩm mỗi trang (nếu không có thì lấy tất cả)
- **Response**:
  - **200 OK**:
    ```json
    {
      "contents": [
        {
          "_id": "string",
          "name": "string",
          "price": 0,
          "description": "string",
          "type": "string",
          "size": [{}],
          "material": "string",
          "images": ["string"],
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "total": 0,
      "page": 0,
      "limit": 0
    }
    ```

### Lấy chi tiết sản phẩm

- **URL**: `/product/:productId`
- **Method**: `GET`
- **Yêu cầu xác thực**: Không
- **Mô tả**: Lấy thông tin chi tiết của một sản phẩm
- **Path Parameters**:
  - `productId`: ID của sản phẩm
- **Response**:
  - **200 OK**:
    ```json
    {
      "_id": "string",
      "name": "string",
      "price": 0,
      "description": "string",
      "type": "string",
      "size": [{}],
      "material": "string",
      "images": ["string"],
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Product not found"
    }
    ```

### Lấy sản phẩm liên quan

- **URL**: `/related-products/:productId`
- **Method**: `GET`
- **Yêu cầu xác thực**: Không
- **Mô tả**: Lấy danh sách sản phẩm liên quan (cùng loại) với sản phẩm hiện tại
- **Path Parameters**:
  - `productId`: ID của sản phẩm
- **Response**:
  - **200 OK**:
    ```json
    {
      "relatedProducts": [
        {
          "_id": "string",
          "name": "string",
          "price": 0,
          "description": "string",
          "type": "string",
          "size": [{}],
          "material": "string",
          "images": ["string"],
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
    ```

### Tạo sản phẩm mới

- **URL**: `/product`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Tạo sản phẩm mới
- **Request Body**:
  ```json
  {
    "name": "string",
    "price": 0,
    "description": "string",
    "type": "string",
    "size": [{}],
    "material": "string",
    "images": ["string"]
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Add Product Successfully"
    }
    ```

## Giỏ hàng

### Lấy giỏ hàng

- **URL**: `/cart/:userId`
- **Method**: `GET`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Lấy thông tin giỏ hàng của người dùng
- **Path Parameters**:
  - `userId`: ID của người dùng
- **Response**:
  - **200 OK**:
    ```json
    {
      "msg": "Get cart successfully",
      "data": [
        {
          "name": "string",
          "price": 0,
          "quantity": 0,
          "size": "string",
          "sku": "string",
          "total": 0,
          "images": ["string"],
          "productId": "string",
          "userId": "string"
        }
      ]
    }
    ```

### Thêm vào giỏ hàng

- **URL**: `/cart`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Thêm sản phẩm vào giỏ hàng
- **Request Body**:
  ```json
  {
    "userId": "string",
    "productId": "string",
    "quantity": 0,
    "size": "string",
    "isMultiple": false
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "msg": "Add to cart successfully"
    }
    ```

### Giảm số lượng trong giỏ hàng

- **URL**: `/cart/decrease`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Giảm số lượng sản phẩm trong giỏ hàng
- **Request Body**:
  ```json
  {
    "userId": "string",
    "productId": "string",
    "quantity": 0
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "msg": "Decrease cart successfully",
      "data": {
        "_id": "string",
        "userId": "string",
        "productId": "string",
        "quantity": 0,
        "size": "string"
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "msg": "Cart not found"
    }
    ```

### Xóa sản phẩm khỏi giỏ hàng

- **URL**: `/cart/deleteItem`
- **Method**: `DELETE`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Xóa một sản phẩm khỏi giỏ hàng
- **Request Body**:
  ```json
  {
    "userId": "string",
    "productId": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "msg": "Delete cart successfully"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "msg": "Cart not found"
    }
    ```

### Xóa toàn bộ giỏ hàng

- **URL**: `/cart/delete`
- **Method**: `DELETE`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Xóa toàn bộ giỏ hàng của người dùng
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "acknowledged": true,
      "deletedCount": 0
    }
    ```

## Người dùng

### Lấy thông tin người dùng

- **URL**: `/user/info/:userId`
- **Method**: `GET`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Lấy thông tin chi tiết của người dùng
- **Path Parameters**:
  - `userId`: ID của người dùng
- **Response**:
  - **200 OK**:
    ```json
    {
      "_id": "string",
      "username": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```

## Đơn hàng

### Tạo đơn hàng

- **URL**: `/orders`
- **Method**: `POST`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Tạo đơn hàng mới từ giỏ hàng
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "companyName": "string",
    "country": "string",
    "street": "string",
    "apartment": "string",
    "cities": "string",
    "state": "string",
    "phone": "string",
    "zipCode": "string",
    "email": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "success": true,
      "message": "Đơn hàng đã được tạo thành công",
      "data": {
        "_id": "string",
        "userId": "string",
        "firstName": "string",
        "lastName": "string",
        "companyName": "string",
        "country": "string",
        "street": "string",
        "apartment": "string",
        "cities": "string",
        "state": "string",
        "phone": "string",
        "zipCode": "string",
        "email": "string",
        "status": "pending",
        "items": [
          {
            "productId": "string",
            "quantity": 0,
            "size": "string",
            "price": 0
          }
        ],
        "totalAmount": 0,
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "success": false,
      "message": "Vui lòng điền đầy đủ thông tin bắt buộc"
    }
    ```
    hoặc
    ```json
    {
      "success": false,
      "message": "Giỏ hàng trống"
    }
    ```

### Lấy danh sách đơn hàng

- **URL**: `/orders`
- **Method**: `GET`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Lấy danh sách đơn hàng của người dùng
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "string",
          "userId": "string",
          "firstName": "string",
          "lastName": "string",
          "companyName": "string",
          "country": "string",
          "street": "string",
          "apartment": "string",
          "cities": "string",
          "state": "string",
          "phone": "string",
          "zipCode": "string",
          "email": "string",
          "status": "string",
          "items": [
            {
              "productId": "string",
              "quantity": 0,
              "size": "string",
              "price": 0
            }
          ],
          "totalAmount": 0,
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
    ```

### Lấy chi tiết đơn hàng

- **URL**: `/orders/:orderId`
- **Method**: `GET`
- **Yêu cầu xác thực**: Có
- **Mô tả**: Lấy thông tin chi tiết của một đơn hàng
- **Path Parameters**:
  - `orderId`: ID của đơn hàng
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "string",
        "userId": "string",
        "firstName": "string",
        "lastName": "string",
        "companyName": "string",
        "country": "string",
        "street": "string",
        "apartment": "string",
        "cities": "string",
        "state": "string",
        "phone": "string",
        "zipCode": "string",
        "email": "string",
        "status": "string",
        "items": [
          {
            "productId": "string",
            "quantity": 0,
            "size": "string",
            "price": 0
          }
        ],
        "totalAmount": 0,
        "paymentInfo": {
          "sepayTransactionId": 0,
          "gateway": "string",
          "transactionDate": "string",
          "accountNumber": "string",
          "transferAmount": 0,
          "referenceCode": "string",
          "content": "string",
          "paidAt": "string"
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "success": false,
      "message": "Không tìm thấy đơn hàng"
    }
    ```

## Thanh toán

### Webhook SePay

- **URL**: `/payment/sepay-callback`
- **Method**: `POST`
- **Yêu cầu xác thực**: API Key
- **Mô tả**: Xử lý webhook callback từ cổng thanh toán SePay
- **Headers**:
  - `Authorization`: `Apikey YOUR_SEPAY_API_KEY`
- **Request Body**:
  ```json
  {
    "id": 0,
    "gateway": "string",
    "transactionDate": "string",
    "accountNumber": "string",
    "code": "string",
    "content": "string",
    "transferType": "string",
    "transferAmount": 0,
    "accumulated": 0,
    "subAccount": "string",
    "referenceCode": "string",
    "description": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Payment processed successfully",
      "data": {
        "orderId": "string",
        "status": "string",
        "transactionId": 0
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "success": false,
      "message": "Unauthorized - Invalid API key"
    }
    ```
