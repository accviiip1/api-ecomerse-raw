import express from 'express';
import { 
  getCampaigns, 
  getCampaignById, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign, 
  toggleCampaignStatus,
  getCampaignStats
} from '../controller/campaign.js';
import { validateCampaign } from '../controller/campaign.js';
import { authMiddleware, adminOnly } from '../middleware/middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: Campaign name
 *         description:
 *           type: string
 *           description: Campaign description
 *         type:
 *           type: string
 *           enum: [percentage, fixed, bogo]
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
 *           description: Whether campaign is active
 *         conditions:
 *           type: object
 *           properties:
 *             newCustomersOnly:
 *               type: boolean
 *             minOrderQuantity:
 *               type: number
 *             specificCategories:
 *               type: array
 *               items:
 *                 type: string
 *             specificProducts:
 *               type: array
 *               items:
 *                 type: string
 *         stats:
 *           type: object
 *           properties:
 *             totalOrders:
 *               type: number
 *             totalRevenue:
 *               type: number
 *             totalDiscount:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaigns]
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
 *     responses:
 *       200:
 *         description: List of campaigns
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
 *                     $ref: '#/components/schemas/Campaign'
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
router.get('/campaigns', authMiddleware, adminOnly, getCampaigns);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campaign not found
 */
router.get('/campaigns/:id', authMiddleware, adminOnly, getCampaignById);

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create new campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - value
 *               - validUntil
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed, bogo]
 *               value:
 *                 type: number
 *               minOrderAmount:
 *                 type: number
 *               maxDiscountAmount:
 *                 type: number
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *               conditions:
 *                 type: object
 *                 properties:
 *                   newCustomersOnly:
 *                     type: boolean
 *                   minOrderQuantity:
 *                     type: number
 *                   specificCategories:
 *                     type: array
 *                     items:
 *                       type: string
 *                   specificProducts:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/campaigns', authMiddleware, adminOnly, createCampaign);

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Update campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed, bogo]
 *               value:
 *                 type: number
 *               minOrderAmount:
 *                 type: number
 *               maxDiscountAmount:
 *                 type: number
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *               conditions:
 *                 type: object
 *                 properties:
 *                   newCustomersOnly:
 *                     type: boolean
 *                   minOrderQuantity:
 *                     type: number
 *                   specificCategories:
 *                     type: array
 *                     items:
 *                       type: string
 *                   specificProducts:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *                 message:
 *                   type: string
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.put('/campaigns/:id', authMiddleware, adminOnly, updateCampaign);

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Delete campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign deleted successfully
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
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.delete('/campaigns/:id', authMiddleware, adminOnly, deleteCampaign);

/**
 * @swagger
 * /campaigns/{id}/toggle:
 *   patch:
 *     summary: Toggle campaign active status
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *                 message:
 *                   type: string
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.patch('/campaigns/:id/toggle', authMiddleware, adminOnly, toggleCampaignStatus);

/**
 * @swagger
 * /campaigns/{id}/stats:
 *   get:
 *     summary: Get campaign statistics
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign statistics
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
 *                     campaign:
 *                       $ref: '#/components/schemas/Campaign'
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalOrders:
 *                           type: number
 *                         totalRevenue:
 *                           type: number
 *                         totalDiscount:
 *                           type: number
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.get('/campaigns/:id/stats', authMiddleware, adminOnly, getCampaignStats);

// Public route to validate campaign code
router.post('/campaigns/validate', validateCampaign);

export default router;
