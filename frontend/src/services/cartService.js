import { cartAPI } from './api';

export const cartService = {
    addToCart: (cartData) => cartAPI.post('/cart/add', cartData),
    removeFromCart: (cartData) => cartAPI.post('/cart/remove', cartData),
    updateCartItem: (cartData) => cartAPI.put('/cart/update', cartData),
    getCart: (userId) => cartAPI.get(`/cart/${userId}`),
    clearCart: (userId) => cartAPI.delete(`/cart/${userId}`),
}; 