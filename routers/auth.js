/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         name:
 *           type: string
 *           description: The full name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *         address:
 *           type: string
 *           description: The address of the user
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: The role of the user
 *         isActive:
 *           type: boolean
 *           description: Whether the user account is active
 *         isAdmin:
 *           type: boolean
 *           description: Whether the user is an admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         username: john_doe
 *         password: password123
 *         name: John Doe
 *         email: john.doe@example.com
 *         phone: +1234567890
 *         address: 123 Main St, City, Country
 *         role: user
 *         isActive: true
 *         isAdmin: false
 *         createdAt: 2024-01-07T10:30:00Z
 */

import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const handleValidateReq = ({ username, password }, res) => {
    if (!username || !password) {
        return res.json({ message: 'Username and password are required' });
    }
};

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the account
 *               password:
 *                 type: string
 *                 description: Password for the account
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 description: Email address
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               address:
 *                 type: string
 *                 description: Address
 *           example:
 *             username: john_doe
 *             password: password123
 *             name: John Doe
 *             email: john.doe@example.com
 *             phone: +1234567890
 *             address: 123 Main St, City, Country
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists or validation error
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request body:', req.body);
        
        const { 
            username, 
            password, 
            name, 
            email, 
            phone, 
            address 
        } = req.body;

        // Validate required fields
        if (!username || !password) {
            console.log('Missing required fields:', { username: !!username, password: !!password });
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            console.log('User already exists:', username);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if email already exists (if provided)
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                console.log('Email already exists:', email);
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        // Create new user with all fields
        user = new User({ 
            username, 
            password, 
            name: name || '',
            email: email || '',
            phone: phone || '',
            address: address || '',
            role: 'user',
            isActive: true,
            isAdmin: false 
        });
        
        console.log('Creating user with data:', {
            username,
            name,
            email,
            phone,
            address
        });
        
        await user.save();

        res.status(201).json({ 
            message: 'User created successfully', 
            user: { 
                id: user._id, 
                username: user.username, 
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                isActive: user.isActive,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            } 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const isValid = handleValidateReq({ username, password }, res);

        if (isValid) {
            return;
        }

        // Hardcoded admin access (no DB needed)
        if (username === 'admin' && password === 'admin123') {
            const token = jwt.sign({ id: 'admin', username: 'admin', isAdmin: true, adminOverride: true }, 'dunglv', {
                expiresIn: '30m'
            });
            const refreshToken = jwt.sign({ id: 'admin', username: 'admin', isAdmin: true, adminOverride: true }, 'dunglv', {
                expiresIn: '7d'
            });
            return res.json({
                accessToken: token,
                refreshToken,
                user: {
                    id: 'admin',
                    username: 'admin',
                    name: 'Administrator',
                    email: '',
                    phone: '',
                    address: '',
                    role: 'admin',
                    isActive: true,
                    isAdmin: true,
                    createdAt: new Date().toISOString()
                }
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Check if user is active (not banned)
        if (user.isActive === false) {
            return res.status(403).json({ message: 'Account has been banned. Please contact support.' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username, isAdmin: user.isAdmin }, 'dunglv', {
            expiresIn: '5m'
        });
        const refreshToken = jwt.sign({ id: user._id, username, isAdmin: user.isAdmin }, 'dunglv', {
            expiresIn: '7d'
        });
        res.json({ 
            accessToken: token, 
            refreshToken, 
            user: { 
                id: user._id, 
                username: user.username, 
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                isActive: user.isActive,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const isValidRefreshToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, 'dunglv');
        return decoded;
    } catch (error) {
        return false;
    }
};

router.post('/refresh-token', async (req, res) => {
    try {
        const { token: refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(403).json({ message: 'No refresh token provided' });
        }

        const validRefreshToken = isValidRefreshToken(refreshToken);

        if (!validRefreshToken) {
            return res
                .status(403)
                .json({ message: 'Invalid or expired refresh token' });
        }

        // Hardcoded admin refresh path
        if (validRefreshToken.username === 'admin' && validRefreshToken.adminOverride) {
            const newAccessToken = jwt.sign(
                { id: 'admin', username: 'admin', isAdmin: true, adminOverride: true },
                'dunglv',
                { expiresIn: '30m' }
            );
            return res.json({
                accessToken: newAccessToken,
                user: {
                    id: 'admin', username: 'admin', name: 'Administrator', email: '', phone: '', address: '', role: 'admin', isActive: true, isAdmin: true, createdAt: new Date().toISOString()
                }
            });
        }

        // Get fresh user data (normal users)
        const user = await User.findById(validRefreshToken.id);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        // Check if user is still active (not banned)
        if (user.isActive === false) {
            return res.status(403).json({ message: 'Account has been banned. Please contact support.' });
        }

        const newAccessToken = jwt.sign(
            { id: user._id, username: user.username, isAdmin: user.isAdmin },
            'dunglv',
            { expiresIn: '5m' }
        );

        res.json({ 
            accessToken: newAccessToken,
            user: { 
                id: user._id, 
                username: user.username, 
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                isActive: user.isActive,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            } 
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Server error during token refresh' });
    }
});


router.post('/seed-admin', async (req, res) => {
    try {
        const username = req.body?.username || 'admin'
        const password = req.body?.password || 'admin123'
        const { name, email, phone, address } = req.body

        let user = await User.findOne({ username })
        if (!user) {
            user = new User({ 
                username, 
                password, 
                name: name || 'Admin User',
                email: email || '',
                phone: phone || '',
                address: address || '',
                role: 'admin',
                isActive: true,
                isAdmin: true 
            })
            await user.save()
            return res.status(201).json({ 
                message: 'Admin user created', 
                user: { 
                    id: user._id, 
                    username: user.username, 
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                    isActive: user.isActive,
                    isAdmin: user.isAdmin,
                    createdAt: user.createdAt
                } 
            })
        }

        let updated = false
        if (!user.isAdmin) {
            user.isAdmin = true
            user.role = 'admin'
            updated = true
        }
        if (req.body?.password) {
            user.password = req.body.password
            updated = true
        }
        if (name) {
            user.name = name
            updated = true
        }
        if (email) {
            user.email = email
            updated = true
        }
        if (phone) {
            user.phone = phone
            updated = true
        }
        if (address) {
            user.address = address
            updated = true
        }
        
        if (updated) {
            await user.save()
            return res.json({ 
                message: 'Admin user updated', 
                user: { 
                    id: user._id, 
                    username: user.username, 
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                    isActive: user.isActive,
                    isAdmin: user.isAdmin,
                    createdAt: user.createdAt
                } 
            })
        }
        return res.json({ 
            message: 'Admin already exists', 
            user: { 
                id: user._id, 
                username: user.username, 
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                isActive: user.isActive,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            } 
        })
    } catch (error) {
        console.error('Seed admin error:', error)
        res.status(500).json({ message: error.message })
    }
})

export default router;
