import mongoose from "mongoose";
import BaseSchema from "./Base.js";

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'bogo'],
    default: 'percentage'
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  conditions: {
    newCustomersOnly: {
      type: Boolean,
      default: false
    },
    minOrderQuantity: {
      type: Number,
      default: 1
    },
    specificCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    specificProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    totalDiscount: {
      type: Number,
      default: 0
    }
  }
}, { timestamps: true });

CampaignSchema.add(BaseSchema);

export default mongoose.model("Campaign", CampaignSchema);
