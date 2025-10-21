import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getCart = async (req, res) => {
    try {
        // Truy vấn giỏ hàng của người dùng để lấy danh sách các mục giỏ hàng
        const cart = await Cart.find({ userId: req.params.userId });

        // Tạo một danh sách productId từ các mục giỏ hàng
        const productIds = cart.map((item) => item.productId);

        // Truy vấn để lấy thông tin chi tiết của các sản phẩm
        const products = await Product.find({ _id: { $in: productIds } });

        const cartWithProductDetails = cart.map((item) => {
            return {
                name: products.find(
                    (product) => product._id.toString() === item.productId
                ).name,
                price: products.find(
                    (product) => product._id.toString() === item.productId
                ).price,
                quantity: item.quantity,
                size: item.size,
                sku: '87654',
                total:
                    item.quantity *
                    products.find(
                        (product) => product._id.toString() === item.productId
                    ).price,
                images: products.find(
                    (product) => product._id.toString() === item.productId
                ).images,
                productId: item.productId,
                userId: item.userId
            };
        });

        return res.status(200).send({
            msg: 'Get cart successfully',
            data: cartWithProductDetails
        });
    } catch (error) {
        return res.status(500).send({
            msg: 'Failed to retrieve cart',
            error: error.message
        });
    }
};

const addToCart = async (req, res) => {
    const { productId, quantity, userId, size, isMultiple = false } = req.body;
    let cart = await Cart.findOne({ userId, productId, size });

    if (cart) {
        if (isMultiple) {
            cart.quantity = +quantity;
        } else {
            cart.quantity += +quantity;
        }
    } else {
        cart = new Cart({ userId, productId, quantity, size });
    }

    await cart.save();

    return res.status(201).send({ msg: 'Add to cart successfully' });
};

const decreaseCart = async (req, res) => {
    const { productId, quantity, userId } = req.body;

    const cart = await Cart.findOne({ userId, productId });

    if (!cart) {
        return res.status(404).send({ msg: 'Cart not found' });
    }

    if (cart.quantity === 1) {
        const cart = await Cart.findOneAndDelete({ userId, productId });
        return res.send(cart);
    }

    cart.quantity -= +quantity;
    await cart.save();

    return res.send({
        msg: 'Decrease cart successfully',
        data: cart
    });
};

const deleteItemCart = async (req, res) => {
    const { productId, userId } = req.body;

    if (!productId || !userId) {
        return res.status(400).send({ msg: 'Missing productId or userId' });
    }

    try {
        const cart = await Cart.findOneAndDelete({ userId, productId });

        if (!cart) {
            return res.status(404).send({ msg: 'Cart not found' });
        }

        return res.status(200).send({ msg: 'Delete cart successfully' });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
};

const deleteAllCart = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send({ msg: 'Missing userId' });
    }

    const cart = await Cart.deleteMany({ userId });

    if (!cart) {
        return res.status(400).send({ msg: 'Cart not found' });
    }

    return res.send(cart);
};

export { decreaseCart, deleteItemCart, addToCart, getCart, deleteAllCart };
