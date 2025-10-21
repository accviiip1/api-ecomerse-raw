import Campaign from '../models/Campaign.js';

const getCampaigns = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', status = 'all' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const filter = {};
        
        // Search filter
        if (search) {
            filter.$or = [
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

        const [campaigns, total] = await Promise.all([
            Campaign.find(filter)
                .populate('conditions.specificCategories', 'name')
                .populate('conditions.specificProducts', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Campaign.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: campaigns,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id)
            .populate('conditions.specificCategories', 'name')
            .populate('conditions.specificProducts', 'name');

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        res.json({ success: true, data: campaign });
    } catch (error) {
        console.error('Get campaign error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createCampaign = async (req, res) => {
    try {
        const campaignData = req.body;
        const campaign = new Campaign(campaignData);
        await campaign.save();

        res.status(201).json({ success: true, data: campaign, message: 'Campaign created successfully' });
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const campaign = await Campaign.findByIdAndUpdate(id, updateData, { new: true })
            .populate('conditions.specificCategories', 'name')
            .populate('conditions.specificProducts', 'name');

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        res.json({ success: true, data: campaign, message: 'Campaign updated successfully' });
    } catch (error) {
        console.error('Update campaign error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findByIdAndDelete(id);

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        res.json({ success: true, message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        campaign.isActive = !campaign.isActive;
        await campaign.save();

        res.json({ 
            success: true, 
            data: campaign, 
            message: `Campaign ${campaign.isActive ? 'activated' : 'deactivated'} successfully` 
        });
    } catch (error) {
        console.error('Toggle campaign status error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCampaignStats = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        // In a real implementation, you would calculate these stats from orders
        // For now, we'll return the stored stats
        res.json({ 
            success: true, 
            data: {
                campaign: campaign,
                stats: campaign.stats
            }
        });
    } catch (error) {
        console.error('Get campaign stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { 
    getCampaigns, 
    getCampaignById, 
    createCampaign, 
    updateCampaign, 
    deleteCampaign, 
    toggleCampaignStatus,
    getCampaignStats 
};

// Validate a campaign code and calculate discount amount
export const validateCampaign = async (req, res) => {
  try {
    const { code, userId, orderAmount, items = [] } = req.body || {};

    if (!code) {
      return res.status(400).json({ success: false, message: 'Campaign code is required' });
    }

    // For simplicity, we match by name (uppercase compare). In production, add a dedicated 'code' field.
    const campaign = await Campaign.findOne({
      name: { $regex: `^${code}$`, $options: 'i' },
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Invalid or expired campaign' });
    }

    const amount = Number(orderAmount) || 0;
    if (campaign.minOrderAmount && amount < campaign.minOrderAmount) {
      return res.status(400).json({ success: false, message: `Minimum order amount of $${campaign.minOrderAmount} required` });
    }

    // TODO: enforce other conditions (newCustomersOnly, specific categories/products) based on items
    let discountAmount = 0;
    if (campaign.type === 'percentage') {
      discountAmount = (amount * Number(campaign.value || 0)) / 100;
      if (campaign.maxDiscountAmount && discountAmount > campaign.maxDiscountAmount) {
        discountAmount = campaign.maxDiscountAmount;
      }
    } else if (campaign.type === 'fixed') {
      discountAmount = Math.min(Number(campaign.value || 0), amount);
    } else if (campaign.type === 'bogo') {
      // Simplified: not implemented for now
      discountAmount = 0;
    }

    return res.json({
      success: true,
      data: {
        campaign: {
          _id: campaign._id,
          name: campaign.name,
          type: campaign.type,
          value: campaign.value,
          discountAmount: Math.round(discountAmount * 100) / 100,
          minOrderAmount: campaign.minOrderAmount,
          maxDiscountAmount: campaign.maxDiscountAmount
        }
      }
    })
  } catch (error) {
    console.error('Validate campaign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
