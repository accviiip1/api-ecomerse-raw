import mongoose from 'mongoose';
import BaseSchema from './Base.js';

const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
});

CartSchema.add(BaseSchema);

export default mongoose.model('Cart', CartSchema);
