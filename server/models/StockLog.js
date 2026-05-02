const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    changeType: {
        type: String,
        required: true,
        enum: ['ADD', 'SALE']
    },
    quantity: {
        type: Number,
        required: true
    },
    currentStock: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StockLog', stockLogSchema);
