import Product from '../models/Product.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';

const createProduct = async (req, res) => {
    const { name, price, description, type, size, material, images, category, brand, categoryId, brandId, visible, colors, styles } = req.body;

    try {
        await Product.create({
            name,
            price,
            description,
            type,
            size,
            material,
            images,
            categoryId: category || categoryId || null,
            brandId: brand || brandId || null,
            visible: typeof visible === 'boolean' ? visible : true,
            colors: Array.isArray(colors) ? colors : undefined,
            styles: Array.isArray(styles) ? styles : undefined,
        });

        return res.status(201).send('Add Product Successfully');
    } catch (error) {
        res.status(500).send(error);
    }
};

const getProduct = async (req, res) => {
    const { page = 1, limit, sortType = '0', brandId, categoryId, q } = req.query;

    const baseFilter = {};
    if (brandId) baseFilter.brandId = String(brandId);
    if (categoryId) baseFilter.categoryId = String(categoryId);
    if (q && String(q).trim().length > 0) {
        const term = String(q).trim();
        baseFilter.$or = [
            { name: { $regex: term, $options: 'i' } },
            { description: { $regex: term, $options: 'i' } },
            { type: { $regex: term, $options: 'i' } }, // allow search by SKU
        ];
    }

    const total = await Product.countDocuments(baseFilter);

    const pageNumber = parseInt(page, 10);
    const limitNumber = limit ? parseInt(limit, 10) : null;

    // Kiểm tra page phải là số nguyên dương
    if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
        return res.status(400).json({
            message: 'Giá trị page không hợp lệ, phải là số nguyên dương'
        });
    }

    // Kiểm tra limit phải là số nguyên dương nếu nó tồn tại
    if (limit && (!Number.isInteger(limitNumber) || limitNumber <= 0)) {
        return res.status(400).json({
            message: 'Giá trị limit không hợp lệ, phải là số nguyên dương'
        });
    }

    let sortCondition;

    switch (sortType) {
        case '0':
            sortCondition = { createdAt: 1 };
            break;
        case '3':
            sortCondition = { createdAt: -1 };
            break;
        case '4':
            sortCondition = { price: 1 };
            break;
        case '5':
            sortCondition = { price: -1 };
            break;
        default:
            sortCondition = { createdAt: 1 };
            break;
    }

    const pipeline = [];
    if (Object.keys(baseFilter).length) pipeline.push({ $match: baseFilter });
    pipeline.push({ $sort: sortCondition });
    pipeline.push({ $skip: (pageNumber - 1) * (limitNumber || 0) });

    if (limitNumber) {
        pipeline.push({ $limit: limitNumber });
    }

    const products = await Product.aggregate(pipeline);

    // Preload brand and category names for decoration
    const [brands, categories] = await Promise.all([
        Brand.find({}, '_id name').lean(),
        Category.find({}, '_id name').lean(),
    ]);
    const brandIdToName = Object.fromEntries((brands || []).map(b => [String(b._id), b.name]));
    const categoryIdToName = Object.fromEntries((categories || []).map(c => [String(c._id), c.name]));

    // compat: add sku alias for FE, compute totalStock if size has stock
    const compatProducts = products.map((p) => {
        const totalStock = Array.isArray(p.size)
            ? p.size.reduce((s, it) => s + (Number(it?.stock || 0)), 0)
            : (typeof p.stock === 'number' ? p.stock : undefined)
        return {
            ...p,
            sku: p.type, // alias
            totalStock,
            brand: p.brandId ? { _id: p.brandId, name: brandIdToName[String(p.brandId)] || undefined } : undefined,
            category: p.categoryId ? { _id: p.categoryId, name: categoryIdToName[String(p.categoryId)] || undefined } : undefined,
        };
    });

    const datas = {
        contents: compatProducts,
        total,
        page,
        limit
    };

    return res.send(datas);
};

const getDetailProduct = async (req, res) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        return res.status(404).send('Product not found');
    }

    // compat field mappings
    const totalStock = Array.isArray(product.size)
        ? product.size.reduce((s, it) => s + (Number(it?.stock || 0)), 0)
        : (typeof product.stock === 'number' ? product.stock : undefined)
    // decorate names
    let brandDecor, categoryDecor;
    if (product.brandId) {
        const b = await Brand.findById(product.brandId).lean();
        if (b) brandDecor = { _id: String(b._id), name: b.name };
    }
    if (product.categoryId) {
        const c = await Category.findById(product.categoryId).lean();
        if (c) categoryDecor = { _id: String(c._id), name: c.name };
    }

    const compat = {
        ...product.toObject(),
        sku: product.type,
        totalStock,
        brand: brandDecor,
        category: categoryDecor,
    };
    return res.send(compat);
};

const getRelatedProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Tìm sản phẩm hiện tại
        const currentProduct = await Product.findById(productId);
        if (!currentProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Tìm các sản phẩm cùng danh mục, loại bỏ chính nó
        const relatedProducts = await Product.find({
            type: currentProduct.type,
            _id: { $ne: productId } // Loại trừ sản phẩm hiện tại
        }).limit(5); // Giới hạn 5 sản phẩm liên quan

        res.json({ relatedProducts });
    } catch (error) {
        console.error('Lỗi lấy sản phẩm liên quan:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

export { createProduct, getProduct, getDetailProduct, getRelatedProduct };
// New: update & delete
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const update = req.body;
        const doc = await Product.findByIdAndUpdate(productId, update, { new: true });
        if (!doc) return res.status(404).send('Product not found');
        return res.json(doc);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const doc = await Product.findByIdAndDelete(productId);
        if (!doc) return res.status(404).send('Product not found');
        return res.json({ message: 'Deleted' });
    } catch (error) {
        return res.status(500).send(error);
    }
};

export { updateProduct, deleteProduct };
