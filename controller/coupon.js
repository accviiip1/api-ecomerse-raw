import Coupon from '../models/Coupon.js';

const getCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', status = 'all', type = 'all' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const filter = {};
        
        // Search filter
        if (search) {
            filter.$or = [
                { code: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Status filter
        if (status === 'active') {
            filter.isActive = true;
            filter.validUntil = { $gte: new Date() };
        } else if (status === 'expired') {
            filter.validUntil = { $lt: new Date() };
        } else if (status === 'inactive') {
            filter.isActive = false;
        }

        // Type filter
        if (type !== 'all') {
            filter.type = type;
        }

        const [coupons, total] = await Promise.all([
            Coupon.find(filter)
                .populate('categoryIds', 'name')
                .populate('productIds', 'name')
                .populate('userIds', 'username name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Coupon.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: coupons,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCouponById = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id)
            .populate('categoryIds', 'name')
            .populate('productIds', 'name')
            .populate('userIds', 'username name');

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.json({ success: true, data: coupon });
    } catch (error) {
        console.error('Get coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createCoupon = async (req, res) => {
    try {
        const couponData = req.body;
        
        // Check if code already exists
        const existingCoupon = await Coupon.findOne({ code: couponData.code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

        // Convert code to uppercase
        couponData.code = couponData.code.toUpperCase();

        const coupon = new Coupon(couponData);
        await coupon.save();

        res.status(201).json({ success: true, data: coupon, message: 'Coupon created successfully' });
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If updating code, check for duplicates
        if (updateData.code) {
            const existingCoupon = await Coupon.findOne({ 
                code: updateData.code.toUpperCase(), 
                _id: { $ne: id } 
            });
            if (existingCoupon) {
                return res.status(400).json({ success: false, message: 'Coupon code already exists' });
            }
            updateData.code = updateData.code.toUpperCase();
        }

        const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true })
            .populate('categoryIds', 'name')
            .populate('productIds', 'name')
            .populate('userIds', 'username name');

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.json({ success: true, data: coupon, message: 'Coupon updated successfully' });
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleCouponStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.json({ 
            success: true, 
            data: coupon, 
            message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully` 
        });
    } catch (error) {
        console.error('Toggle coupon status error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { code, userId, orderAmount } = req.body;
        
        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(),
            isActive: true,
            validFrom: { $lte: new Date() },
            validUntil: { $gte: new Date() }
        });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'Coupon usage limit exceeded' });
        }

        // Check minimum order amount
        if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({ 
                success: false, 
                message: `Minimum order amount of $${coupon.minOrderAmount} required` 
            });
        }

        // Check if user has reached usage limit per user
        if (userId && coupon.usageLimitPerUser) {
            // In a real implementation, you would check user's coupon usage history
            // For now, we'll skip this check
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.type === 'percentage') {
            discountAmount = (orderAmount * coupon.value) / 100;
            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
            }
        } else if (coupon.type === 'fixed') {
            discountAmount = Math.min(coupon.value, orderAmount);
        }

        res.json({
            success: true,
            data: {
                coupon: {
                    _id: coupon._id,
                    code: coupon.code,
                    name: coupon.name,
                    type: coupon.type,
                    value: coupon.value,
                    discountAmount: Math.round(discountAmount * 100) / 100,
                    minOrderAmount: coupon.minOrderAmount,
                    maxDiscountAmount: coupon.maxDiscountAmount
                }
            }
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus, validateCoupon };
