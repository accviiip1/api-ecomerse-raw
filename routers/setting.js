import express from 'express'
import { getSetting, upsertSetting } from '../controller/setting.js'
import { authMiddleware } from '../middleware/middleware.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: System settings
 */

/**
 * @swagger
 * /api/v1/settings:
 *   get:
 *     tags: [Settings]
 *     summary: Get settings
 *     responses:
 *       200:
 *         description: OK
 *   put:
 *     tags: [Settings]
 *     summary: Upsert settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Setting'
 *     responses:
 *       200:
 *         description: Updated
 */
router.get('/settings', getSetting)
router.put('/settings', authMiddleware, upsertSetting)
// Test endpoint without auth
router.put('/settings/test', upsertSetting)
// Public endpoint for testing
router.post('/settings/public', upsertSetting)

export default router


