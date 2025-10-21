import express from 'express';
import { getInfoUser, listUsers, toggleActive, getUserProfile, updateUserProfile, changePassword, uploadAvatar } from '../controller/user.js';
import { authMiddleware } from '../middleware/middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 */

/**
 * @swagger
 * /api/v1/user/info/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user info by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/user/info/:userId', authMiddleware, getInfoUser);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: List users (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/users', authMiddleware, listUsers);

/**
 * @swagger
 * /api/v1/user/{userId}/toggle-active:
 *   patch:
 *     tags: [Users]
 *     summary: Toggle active/ban user (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.patch('/user/:userId/toggle-active', authMiddleware, toggleActive);

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/user/profile', authMiddleware, getUserProfile);

/**
 * @swagger
 * /api/v1/user/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/user/profile', authMiddleware, updateUserProfile);

/**
 * @swagger
 * /api/v1/user/password:
 *   put:
 *     tags: [Users]
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/user/password', authMiddleware, changePassword);

/**
 * @swagger
 * /api/v1/user/avatar:
 *   post:
 *     tags: [Users]
 *     summary: Upload user avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/user/avatar', authMiddleware, uploadAvatar);

// Test endpoints without auth
router.get('/user/profile/test', (req, res) => {
    res.json({
        success: true,
        message: 'User profile API is working',
        data: {
            _id: 'test-user-id',
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            phone: '+84 123 456 789',
            address: 'Test Address',
            dateOfBirth: '1990-01-01',
            gender: 'male',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
            role: 'user',
            isActive: true
        }
    });
});

router.put('/user/profile/test', (req, res) => {
    console.log('Test profile update:', req.body);
    res.json({
        success: true,
        message: 'Profile updated successfully (test)',
        data: req.body
    });
});

export default router;
