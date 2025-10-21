import express from 'express';
import { sepayCallback } from '../controller/payment.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/payment/sepay-callback:
 *   post:
 *     summary: SePay webhook callback để xử lý thông báo thanh toán
 *     tags: [Payment]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - gateway
 *               - transactionDate
 *               - accountNumber
 *               - transferType
 *               - transferAmount
 *               - accumulated
 *               - referenceCode
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 92704
 *                 description: ID giao dịch trên SePay
 *               gateway:
 *                 type: string
 *                 example: "Vietcombank"
 *                 description: Brand name của ngân hàng
 *               transactionDate:
 *                 type: string
 *                 example: "2023-03-25 14:02:37"
 *                 description: Thời gian xảy ra giao dịch phía ngân hàng
 *               accountNumber:
 *                 type: string
 *                 example: "0123499999"
 *                 description: Số tài khoản ngân hàng
 *               code:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *                 description: Mã code thanh toán
 *               content:
 *                 type: string
 *                 example: "chuyen tien mua iphone"
 *                 description: Nội dung chuyển khoản
 *               transferType:
 *                 type: string
 *                 example: "in"
 *                 description: Loại giao dịch (in là tiền vào, out là tiền ra)
 *               transferAmount:
 *                 type: number
 *                 example: 2277000
 *                 description: Số tiền giao dịch
 *               accumulated:
 *                 type: number
 *                 example: 19077000
 *                 description: Số dư tài khoản (lũy kế)
 *               subAccount:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *                 description: Tài khoản ngân hàng phụ
 *               referenceCode:
 *                 type: string
 *                 example: "MBVCB.3278907687"
 *                 description: Mã tham chiếu của tin nhắn sms
 *               description:
 *                 type: string
 *                 example: ""
 *                 description: Toàn bộ nội dung tin nhắn sms
 *     responses:
 *       200:
 *         description: Callback được xử lý thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment processed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                     status:
 *                       type: string
 *                     transactionId:
 *                       type: integer
 *       401:
 *         description: API key không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/payment/sepay-callback', sepayCallback);

export default router;
