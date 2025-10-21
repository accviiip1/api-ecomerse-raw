# Mô tả chi tiết các Model

## Giới thiệu

Dự án sử dụng MongoDB làm cơ sở dữ liệu và Mongoose làm ODM (Object Data Modeling). Các model được định nghĩa trong thư mục `models/` và tuân theo một cấu trúc chung.

## Base Schema

Tất cả các model đều kế thừa từ `BaseSchema`, cung cấp các trường cơ bản:

```javascript
const BaseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
```

- `_id`: ID duy nhất của document, sử dụng UUID v4
- `createdAt`: Thời gian tạo document
- `updatedAt`: Thời gian cập nhật document gần nhất
- `deletedAt`: Thời gian xóa document (soft delete)

## User Model

Model `User` lưu trữ thông tin người dùng:

```javascript
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
```

### Trường dữ liệu

- `username`: Tên đăng nhập, duy nhất trong hệ thống
- `password`: Mật khẩu đã được mã hóa bằng bcrypt

### Phương thức

- `comparePassword(password)`: So sánh mật khẩu đầu vào với mật khẩu đã mã hóa

### Middleware

- `pre('save')`: Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu

## Product Model

Model `Product` lưu trữ thông tin sản phẩm:

```javascript
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: [Object],
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
});
```

### Trường dữ liệu

- `name`: Tên sản phẩm
- `price`: Giá sản phẩm
- `description`: Mô tả sản phẩm
- `type`: Loại sản phẩm (ví dụ: shirt, pants, shoes)
- `size`: Mảng các đối tượng kích thước (ví dụ: `[{name: 'S', quantity: 10}, {name: 'M', quantity: 15}]`)
- `material`: Chất liệu sản phẩm
- `images`: Mảng các URL hình ảnh sản phẩm

## Cart Model

Model `Cart` lưu trữ thông tin giỏ hàng:

```javascript
const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});
```

### Trường dữ liệu

- `userId`: ID của người dùng sở hữu giỏ hàng
- `productId`: ID của sản phẩm trong giỏ hàng
- `quantity`: Số lượng sản phẩm
- `size`: Kích thước sản phẩm

## Order Model

Model `Order` lưu trữ thông tin đơn hàng:

```javascript
const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  apartment: {
    type: String,
    default: '',
  },
  cities: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  items: [
    {
      productId: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentInfo: {
    sepayTransactionId: {
      type: Number,
      default: null,
    },
    gateway: {
      type: String,
      default: null,
    },
    transactionDate: {
      type: String,
      default: null,
    },
    accountNumber: {
      type: String,
      default: null,
    },
    transferAmount: {
      type: Number,
      default: null,
    },
    referenceCode: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
});
```

### Trường dữ liệu

- `userId`: ID của người dùng đặt hàng
- `firstName`, `lastName`: Tên và họ của người đặt hàng
- `companyName`: Tên công ty (tùy chọn)
- `country`, `street`, `apartment`, `cities`, `state`, `zipCode`: Thông tin địa chỉ giao hàng
- `phone`, `email`: Thông tin liên hệ
- `status`: Trạng thái đơn hàng (pending, processing, shipped, delivered, cancelled)
- `items`: Mảng các sản phẩm trong đơn hàng
  - `productId`: ID của sản phẩm
  - `quantity`: Số lượng
  - `size`: Kích thước
  - `price`: Giá sản phẩm
- `totalAmount`: Tổng giá trị đơn hàng
- `paymentInfo`: Thông tin thanh toán
  - `sepayTransactionId`: ID giao dịch từ SePay
  - `gateway`: Cổng thanh toán (ví dụ: Vietcombank)
  - `transactionDate`: Ngày giao dịch
  - `accountNumber`: Số tài khoản
  - `transferAmount`: Số tiền chuyển khoản
  - `referenceCode`: Mã tham chiếu
  - `content`: Nội dung chuyển khoản
  - `paidAt`: Thời gian thanh toán

## Quan hệ giữa các Model

### User - Cart

- Một User có thể có nhiều Cart item
- Mỗi Cart item thuộc về một User (thông qua `userId`)

### User - Order

- Một User có thể có nhiều Order
- Mỗi Order thuộc về một User (thông qua `userId`)

### Product - Cart

- Một Product có thể xuất hiện trong nhiều Cart item
- Mỗi Cart item tham chiếu đến một Product (thông qua `productId`)

### Product - Order

- Một Product có thể xuất hiện trong nhiều Order
- Mỗi Order item tham chiếu đến một Product (thông qua `items.productId`)

## Soft Delete

Tất cả các model đều hỗ trợ soft delete thông qua trường `deletedAt`. Khi một document bị xóa, trường `deletedAt` sẽ được cập nhật thành thời gian hiện tại thay vì xóa document khỏi cơ sở dữ liệu.

Các truy vấn thường sẽ thêm điều kiện `deletedAt: null` để chỉ lấy các document chưa bị xóa.

## Timestamps

Tất cả các model đều có timestamps tự động thông qua tùy chọn `{ timestamps: true }` của Mongoose, cập nhật các trường `createdAt` và `updatedAt` khi document được tạo hoặc cập nhật.
