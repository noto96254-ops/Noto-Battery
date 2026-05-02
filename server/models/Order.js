const mongoose = require('mongoose');

const productItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, { _id: false }); // Disable _id for sub-documents to keep it clean

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [productItemSchema], // Use the formal sub-schema
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    address: {
        name: String,
        phone: String,
        city: String,
        pincode: String,
        detail: String
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Razorpay'
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'Pending'
    },
    paymentId: {
        type: String
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
