const express = require('express');
const { getStockReport, getOrderReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stock', protect, admin, getStockReport);
router.get('/orders', protect, admin, getOrderReport);

module.exports = router;
