const Order = require('../models/Order');
const Product = require('../models/Product');
const StockLog = require('../models/StockLog');

// @desc    Get Stock Report
// @route   GET /api/reports/stock
exports.getStockReport = async (req, res) => {
    const { range } = req.query; // 'day', 'week', 'month', '6month', 'year'
    let startDate = new Date();

    if (range === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (range === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else if (range === '6month') startDate.setMonth(startDate.getMonth() - 6);
    else if (range === 'year') startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate.setHours(0, 0, 0, 0); // Default to today

    try {
        const logs = await StockLog.find({
            timestamp: { $gte: startDate }
        }).populate('product', 'title');

        // Group by product
        const report = {};
        
        logs.forEach(log => {
            const prodId = log.product?._id?.toString();
            if (!prodId) return;

            if (!report[prodId]) {
                report[prodId] = {
                    title: log.product.title,
                    unitsAdded: 0,
                    unitsSold: 0,
                    currentStock: log.currentStock // This will be updated to the latest log's currentStock
                };
            }

            if (log.changeType === 'ADD') {
                report[prodId].unitsAdded += log.quantity;
            } else if (log.changeType === 'SALE') {
                report[prodId].unitsSold += Math.abs(log.quantity);
            }
            
            // Update to latest stock level in the logs for this period
            report[prodId].currentStock = log.currentStock;
        });

        // For products that didn't have logs in this period, we should still show them with 0 changes if needed, 
        // but user specifically asked for "product wise data which product is added how many unts are being added and how much stock is and how much sold"
        // So showing only products with activity in the period makes sense, OR show all products and use logs to fill the diff.
        
        // Let's also fetch all products to show current stock correctly even if no activity
        const allProducts = await Product.find({}, 'title countInStock');
        allProducts.forEach(p => {
            const id = p._id.toString();
            if (!report[id]) {
                report[id] = {
                    title: p.title,
                    unitsAdded: 0,
                    unitsSold: 0,
                    currentStock: p.countInStock
                };
            } else {
                // The currentStock from logs might not be the VERY latest if the last change was outside the period
                // So always use the current actual stock from Product model for the "Current Stock" column
                report[id].currentStock = p.countInStock;
            }
        });

        res.json(Object.values(report));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Order Report
// @route   GET /api/reports/orders
exports.getOrderReport = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
        
        const reportData = orders.map(order => ({
            orderId: order._id,
            customerName: order.user?.name || order.address?.name || 'Guest',
            customerEmail: order.user?.email || 'N/A',
            phone: order.address?.phone || 'N/A',
            address: order.address ? `${order.address.detail || ''}, ${order.address.city || ''} - ${order.address.pincode || ''}` : 'N/A',
            products: order.products ? order.products.map(p => `${p.title} (x${p.quantity})`).join('; ') : 'None',
            totalAmount: order.totalAmount || 0,
            status: order.orderStatus,
            date: order.createdAt
        }));

        res.json(reportData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
