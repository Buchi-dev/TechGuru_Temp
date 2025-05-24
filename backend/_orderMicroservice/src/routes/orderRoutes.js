const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus
} = require('../controllers/orderController');

// Create new order from cart
router.post('/create', createOrder);

// Get order by ID
router.get('/:orderId', getOrderById);

// Get user's order history
router.get('/user/:userId', getUserOrders);

// Update order status
router.put('/:orderId/status', updateOrderStatus);

module.exports = router; 