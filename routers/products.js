import express from 'express';
import {
    createProduct,
    getProduct,
    getDetailProduct,
    getRelatedProduct,
    updateProduct,
    deleteProduct
} from '../controller/product.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Products
 */

/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     tags: [Products]
 *     summary: List products
 *     responses:
 *       200:
 *         description: "OK - response contains alias fields sku and totalStock"
 *   post:
 *     tags: [Products]
 *     summary: Create product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/product', createProduct);

/**
 * @swagger
 * /api/v1/product/{productId}:
 *   get:
 *     tags: [Products]
 *     summary: Get product detail
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: "OK - response contains alias fields sku and totalStock"
 *   put:
 *     tags: [Products]
 *     summary: Update product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     tags: [Products]
 *     summary: Delete product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get('/product/:productId', getDetailProduct);
router.get('/product', getProduct);
router.get('/related-products/:productId', getRelatedProduct);
router.put('/product/:productId', updateProduct);
router.delete('/product/:productId', deleteProduct);

export default router;
