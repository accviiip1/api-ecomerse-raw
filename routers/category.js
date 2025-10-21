import express from 'express'
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controller/category.js'
import { authMiddleware } from '../middleware/middleware.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Catalog
 *     description: Categories & Brands
 */

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     tags: [Catalog]
 *     summary: List categories
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [Catalog]
 *     summary: Create category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/categories', listCategories)
router.post('/categories', authMiddleware, createCategory)

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     tags: [Catalog]
 *     summary: Update category
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     tags: [Catalog]
 *     summary: Delete category
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
router.put('/categories/:id', authMiddleware, updateCategory)
router.delete('/categories/:id', authMiddleware, deleteCategory)

export default router


