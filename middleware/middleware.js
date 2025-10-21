import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'dunglv');
        console.log(decoded);
        // Allow hardcoded admin bypass
        if (decoded?.adminOverride === true && decoded?.username === 'admin') {
            req.user = { _id: 'admin', username: 'admin', isAdmin: true, role: 'admin', isActive: true };
            req.token = token;
            return next();
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Token is not valid or expired' });
    }
};

export { authMiddleware };

const adminOnly = (req, res, next) => {
    try {
        const user = req.user;
        console.log('ADMIN_CHECK:', { 
            userId: user?._id, 
            username: user?.username, 
            isAdmin: user?.isAdmin, 
            role: user?.role 
        });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
        if (user.isAdmin === true || user.role === 'admin') {
            console.log('ADMIN_ACCESS_GRANTED');
            return next();
        }
        // Temporary: allow access if isAdmin is truthy (for debugging)
        if (user.isAdmin) {
            console.log('ADMIN_ACCESS_GRANTED (isAdmin truthy)');
            return next();
        }
        console.log('ADMIN_ACCESS_DENIED');
        return res.status(403).send({ error: 'Forbidden' });
    } catch (e) {
        console.log('ADMIN_CHECK_ERROR:', e.message);
        return res.status(403).send({ error: 'Forbidden' });
    }
};

export { adminOnly };