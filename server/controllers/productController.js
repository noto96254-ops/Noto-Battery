const Product = require('../models/Product');
const StockLog = require('../models/StockLog');

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    const { title, price, category, description, images, countInStock } = req.body;
    try {
        const numPrice = Number(price);
        const numStock = Number(countInStock || 0);

        const product = new Product({ 
            title, 
            price: numPrice, 
            category, 
            description, 
            images, 
            countInStock: numStock 
        });
        const createdProduct = await product.save();

        if (numStock > 0) {
            await StockLog.create({
                product: createdProduct._id,
                changeType: 'ADD',
                quantity: numStock,
                currentStock: numStock
            });
        }

        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    const { title, price, category, description, images, countInStock } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            const oldStock = Number(product.countInStock || 0);
            const newStock = countInStock !== undefined ? Number(countInStock) : oldStock;

            product.title = title !== undefined ? title : product.title;
            product.price = price !== undefined ? Number(price) : product.price;
            product.category = category !== undefined ? category : product.category;
            product.description = description !== undefined ? description : product.description;
            product.images = images !== undefined ? images : product.images;
            product.countInStock = newStock;

            const updatedProduct = await product.save();

            // Log if stock changed manually
            if (countInStock !== undefined && newStock !== oldStock) {
                await StockLog.create({
                    product: updatedProduct._id,
                    changeType: newStock > oldStock ? 'ADD' : 'SALE',
                    quantity: Math.abs(newStock - oldStock),
                    currentStock: newStock
                });
            }

            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
