const Order = require('../models/Order');

// Create new order from cart
const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        
        const order = new Order({
            userId,
            items,
            totalAmount,
            status: 'pending'
        });
        
        await order.save();

        // Publish order.created event
        const channel = req.app.get('channel');
        channel.publish('order_events', 'order.created', Buffer.from(JSON.stringify({
            orderId: order._id,
            userId,
            totalAmount,
            status: order.status
        })));

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// Get user's order history
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.params.userId
        }).sort({ orderDate: -1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user orders',
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        // Publish order status event
        const channel = req.app.get('channel');
        channel.publish('order_events', `order.${status}`, Buffer.from(JSON.stringify({
            orderId: order._id,
            userId: order.userId,
            status
        })));

        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus
}; 