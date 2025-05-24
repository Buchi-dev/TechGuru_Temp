const Cart = require('../models/Cart');

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, price, name } = req.body;
        
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            // Create new cart if it doesn't exist
            cart = new Cart({
                userId,
                items: [{
                    productId,
                    quantity,
                    price,
                    name
                }]
            });
        } else {
            // Check if product already exists in cart
            const existingItem = cart.items.find(item => item.productId === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    productId,
                    quantity,
                    price,
                    name
                });
            }
        }
        
        await cart.save();

        // Publish cart.item.added event
        const channel = req.app.get('channel');
        channel.publish('cart_events', 'cart.item.added', Buffer.from(JSON.stringify({
            userId,
            productId,
            quantity
        })));

        res.json({
            message: 'Item added to cart successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding item to cart',
            error: error.message
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(item => item.productId !== productId);
        await cart.save();

        // Publish cart.item.removed event
        const channel = req.app.get('channel');
        channel.publish('cart_events', 'cart.item.removed', Buffer.from(JSON.stringify({
            userId,
            productId
        })));

        res.json({
            message: 'Item removed from cart successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error removing item from cart',
            error: error.message
        });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        const item = cart.items.find(item => item.productId === productId);
        
        if (!item) {
            return res.status(404).json({
                message: 'Item not found in cart'
            });
        }

        item.quantity = quantity;
        await cart.save();

        // Publish cart.item.updated event
        const channel = req.app.get('channel');
        channel.publish('cart_events', 'cart.item.updated', Buffer.from(JSON.stringify({
            userId,
            productId,
            quantity
        })));

        res.json({
            message: 'Cart item updated successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating cart item',
            error: error.message
        });
    }
};

// Get cart by user ID
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        
        if (!cart) {
            return res.json({
                userId: req.params.userId,
                items: [],
                totalAmount: 0
            });
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching cart',
            error: error.message
        });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        // Publish cart.cleared event
        const channel = req.app.get('channel');
        channel.publish('cart_events', 'cart.cleared', Buffer.from(JSON.stringify({
            userId
        })));

        res.json({
            message: 'Cart cleared successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error clearing cart',
            error: error.message
        });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    updateCartItem,
    getCart,
    clearCart
}; 