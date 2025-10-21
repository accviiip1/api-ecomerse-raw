import express from 'express'
import { listBrands, createBrand, updateBrand, deleteBrand } from '../controller/brand.js'
import { authMiddleware } from '../middleware/middleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/v1/brands:
 *   get:
 *     tags: [Catalog]
 *     summary: List brands
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [Catalog]
 *     summary: Create brand
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/brands', listBrands)
router.post('/brands', authMiddleware, createBrand)

/**
 * @swagger
 * /api/v1/brands/{id}:
 *   put:
 *     tags: [Catalog]
 *     summary: Update brand
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     tags: [Catalog]
 *     summary: Delete brand
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
router.put('/brands/:id', authMiddleware, updateBrand)
router.delete('/brands/:id', authMiddleware, deleteBrand)

export default router


