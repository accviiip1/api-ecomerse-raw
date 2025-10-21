import express from 'express';
import { 
  getCoupons, 
  getCouponById, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon, 
  toggleCouponStatus,
  validateCoupon
} from '../controller/coupon.js';
import { authMiddleware, adminOnly } from '../middleware/middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         code:
 *           type: string
 *           description: Unique coupon code
 *         name:
 *           type: string
 *           description: Coupon name
 *         description:
 *           type: string
 *           description: Coupon description
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: Discount type
 *         value:
 *           type: number
 *           description: Discount value
 *         minOrderAmount:
 *           type: number
 *           description: Minimum order amount required
 *         maxDiscountAmount:
 *           type: number
 *           description: Maximum discount amount
 *         usageLimit:
 *           type: number
 *           description: Total usage limit
 *         usageLimitPerUser:
 *           type: number
 *           description: Usage limit per user
 *         usedCount:
 *           type: number
 *           description: Number of times used
 *         validFrom:
 *           type: string
 *           format: date-time
 *           description: Valid from date
 *         validUntil:
 *           type: string
 *           format: date-time
 *           description: Valid until date
 *         isActive:
 *           type: boolean
 *           description: Whether coupon is active
 *         applicableTo:
 *           type: string
 *           enum: [all, category, product, user]
 *           description: What the coupon applies to
 *         categoryIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Category IDs if applicable to categories
 *         productIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Product IDs if applicable to products
 *         userIds:
 *           type: array
 *           items:
 *             type: string
 *           description: User IDs if applicable to specific users
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, expired, inactive]
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, percentage, fixed]
 *         description: Filter by type
 *     responses:
 *       200:
 *         description: List of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/coupons', authMiddleware, adminOnly, getCoupons);
router.get('/coupons/public', getCoupons);

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *       404:
 *         description: Coupon not found
 */
router.get('/coupons/:id', authMiddleware, adminOnly, getCouponById);

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create new coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - type
 *               - value
 *               - validUntil
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               value:
 *                 type: number
 *               minOrderAmount:
 *                 type: number
 *               maxDiscountAmount:
 *                 type: number
 *               usageLimit:
 *                 type: number
 *               usageLimitPerUser:
 *                 type: number
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *               applicableTo:
 *                 type: string
 *                 enum: [all, category, product, user]
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request (e.g., duplicate code)
 *       500:
 *         description: Server error
 */
router.post('/coupons', authMiddleware, adminOnly, createCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   put:
 *     summary: Update coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               value:
 *                 type: number
 *               minOrderAmount:
 *                 type: number
 *               maxDiscountAmount:
 *                 type: number
 *               usageLimit:
 *                 type: number
 *               usageLimitPerUser:
 *                 type: number
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *               applicableTo:
 *                 type: string
 *                 enum: [all, category, product, user]
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *                 message:
 *                   type: string
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
 */
router.put('/coupons/:id', authMiddleware, adminOnly, updateCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Delete coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
 */
router.delete('/coupons/:id', authMiddleware, adminOnly, deleteCoupon);

/**
 * @swagger
 * /coupons/{id}/toggle:
 *   patch:
 *     summary: Toggle coupon active status
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *                 message:
 *                   type: string
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
 */
router.patch('/coupons/:id/toggle', authMiddleware, adminOnly, toggleCouponStatus);

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     summary: Validate coupon code
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - orderAmount
 *             properties:
 *               code:
 *                 type: string
 *                 description: Coupon code to validate
 *               userId:
 *                 type: string
 *                 description: User ID (optional)
 *               orderAmount:
 *                 type: number
 *                 description: Order amount for validation
 *     responses:
 *       200:
 *         description: Coupon validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     coupon:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         code:
 *                           type: string
 *                         name:
 *                           type: string
 *                         type:
 *                           type: string
 *                         value:
 *                           type: number
 *                         discountAmount:
 *                           type: number
 *                         minOrderAmount:
 *                           type: number
 *                         maxDiscountAmount:
 *                           type: number
 *       400:
 *         description: Invalid coupon or validation failed
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
 */
router.post('/coupons/validate', validateCoupon);

export default router;
