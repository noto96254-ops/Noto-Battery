const express = require('express');
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getOrders);
router.put('/:id', protect, admin, updateOrderStatus);


module.exports = router;
