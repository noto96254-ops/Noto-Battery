const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @desc    Create Razorpay order
// @route   POST /api/payment/order
exports.createRazorpayOrder = async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        console.log('◇ Creating Razorpay Order with options:', options);
        const order = await razorpay.orders.create(options);
        console.log('◇ Razorpay Order Created Successfully:', order.id);
        res.json(order);
    } catch (error) {
        console.error('◈ Razorpay Order Creation Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        
        console.log('◇ Verifying Payment for Order:', razorpay_order_id);
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            console.log('◇ Payment Verification SUCCESS');
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            console.error('◈ Payment Verification FAILED: Signature Mismatch');
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error('◈ Payment Verification Exception:', error);
        res.status(500).json({ message: error.message });
    }
};
