import User from '../models/User.js';

const getInfoUser = async (req, res) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        return res.status(404).send('User not found');
    }

    const amountCart = await User.aggregate([
        { $match: { _id: user._id } },
        {
            $lookup: {
                from: 'carts',
                localField: '_id',
                foreignField: 'userId',
                as: 'carts'
            }
        },
        { $unwind: '$carts' },
        {
            $group: {
                _id: '$_id',
                amountCart: { $sum: '$carts.quantity' }
            }
        }
    ]);

    console.log(amountCart);

    if (amountCart.length > 0) {
        user.amountCart = amountCart[0].amountCart;
    }

    const data = {
        username: user.username,
        id: user._id,
        deletedAt: user.deletedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        amountCart: user.amountCart,
        // compat fields for admin dashboard
        role: user.role || (user.isAdmin ? 'admin' : 'user'),
        isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
    };

    return res.send({
        msg: 'Get info user successfully',
        data
    });
};

const listUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 })
            .sort({ createdAt: -1 })
        
        // Calculate totalOrders and totalSpent for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            try {
                // Get user's orders
                const Order = (await import('../models/Order.js')).default
                const orders = await Order.find({ user: user._id, deletedAt: null })
                
                // Calculate statistics
                const totalOrders = orders.length
                const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                
                return {
                    ...user.toObject(),
                    totalOrders,
                    totalSpent: Math.round(totalSpent * 100) / 100 // Round to 2 decimal places
                }
            } catch (error) {
                console.error(`Error calculating stats for user ${user._id}:`, error)
                return {
                    ...user.toObject(),
                    totalOrders: 0,
                    totalSpent: 0
                }
            }
        }))
        
        return res.json(usersWithStats)
    } catch (error) {
        console.error('List users error:', error)
        return res.status(500).json({ message: error.message })
    }
}

const toggleActive = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User not found' })
        
        // Toggle isActive field
        user.isActive = !user.isActive
        await user.save()
        
        console.log(`User ${user.username} ${user.isActive ? 'activated' : 'banned'}`)
        
        return res.json({ 
            id: user._id, 
            isActive: user.isActive,
            message: `User ${user.isActive ? 'activated' : 'banned'} successfully`
        })
    } catch (error) {
        console.error('Toggle active error:', error)
        return res.status(500).json({ message: error.message })
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            address: user.address || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender || '',
            avatar: user.avatar || '',
            role: user.role || 'user',
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }

        res.json(userData)
    } catch (error) {
        console.error('Get user profile error:', error)
        res.status(500).json({ message: error.message })
    }
}

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { firstName, lastName, phone, address, dateOfBirth, gender, email } = req.body

        // Update user fields
        if (firstName !== undefined) user.firstName = firstName
        if (lastName !== undefined) user.lastName = lastName
        if (phone !== undefined) user.phone = phone
        if (address !== undefined) user.address = address
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth
        if (gender !== undefined) user.gender = gender
        if (email !== undefined) user.email = email

        await user.save()

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                avatar: user.avatar
            }
        })
    } catch (error) {
        console.error('Update user profile error:', error)
        res.status(500).json({ message: error.message })
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { currentPassword, newPassword } = req.body

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword)
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' })
        }

        // Update password
        user.password = newPassword
        await user.save()

        res.json({
            success: true,
            message: 'Password changed successfully'
        })
    } catch (error) {
        console.error('Change password error:', error)
        res.status(500).json({ message: error.message })
    }
}

// Upload avatar
const uploadAvatar = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // In a real app, you would handle file upload here
        // For now, we'll just simulate it
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`

        user.avatar = avatarUrl
        await user.save()

        res.json({
            success: true,
            message: 'Avatar updated successfully',
            data: { avatar: avatarUrl }
        })
    } catch (error) {
        console.error('Upload avatar error:', error)
        res.status(500).json({ message: error.message })
    }
}

export { getInfoUser, listUsers, toggleActive, getUserProfile, updateUserProfile, changePassword, uploadAvatar };
