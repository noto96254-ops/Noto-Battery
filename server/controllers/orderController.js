const Order = require('../models/Order');
const Product = require('../models/Product');
const StockLog = require('../models/StockLog');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../config/emailConfig');

// @desc    Create new order
// @route   POST /api/orders
exports.addOrderItems = async (req, res) => {
    const { products, totalAmount, address, paymentMethod, paymentStatus, paymentId } = req.body;

    if (products && products.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        try {
            // Verify stock availability first
            for (const item of products) {
                const product = await Product.findById(item._id);
                if (!product || product.countInStock < item.quantity) {
                    return res.status(400).json({ 
                        message: `Insufficient stock for ${item.title || 'one or more items'}. Available: ${product ? product.countInStock : 0}` 
                    });
                }
            }

            const order = new Order({
                user: req.user._id,
                products: products.map(p => ({
                    title: p.title,
                    price: p.price,
                    quantity: p.quantity,
                    image: p.image,
                    product: p._id
                })),
                totalAmount,
                address,
                paymentMethod,
                paymentStatus,
                paymentId
            });

            const createdOrder = await order.save();

            // Deduct Stock and Log
            for (const item of products) {
                const product = await Product.findById(item._id);
                if (product) {
                    product.countInStock -= item.quantity;
                    await product.save();

                    await StockLog.create({
                        product: product._id,
                        changeType: 'SALE',
                        quantity: -item.quantity,
                        currentStock: product.countInStock
                    });
                }
            }
            
            if (req.user.email) {
                sendOrderConfirmation(req.user.email, createdOrder);
            }

            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort('-createdAt');
        console.log(`Found ${orders.length} orders in DB`);
        res.json(orders);
    } catch (error) {
        console.error('Error in getOrders:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'email');
        if (order) {
            order.orderStatus = req.body.orderStatus || order.orderStatus;
            const updatedOrder = await order.save();
            
            if (order.user && order.user.email) {
                sendOrderStatusUpdate(order.user.email, updatedOrder);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
