import express from 'express';
import {
    getCart,
    addToCart,
    decreaseCart,
    deleteItemCart,
    deleteAllCart
} from '../controller/cart.js';

const router = express.Router();

router.post('/cart', addToCart);
router.post('/cart/decrease', decreaseCart);
router.delete('/cart/deleteItem', deleteItemCart);
router.delete('/cart/delete', deleteAllCart);
router.get('/cart/:userId', getCart);

export default router;
