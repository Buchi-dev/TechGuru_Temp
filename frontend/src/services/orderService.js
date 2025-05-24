import { orderAPI } from './api';

export const orderService = {
    createOrder: (orderData) => orderAPI.post('/orders/create', orderData),
    getOrderById: (orderId) => orderAPI.get(`/orders/${orderId}`),
    getUserOrders: (userId) => orderAPI.get(`/orders/user/${userId}`),
    updateOrderStatus: (orderId, status) => orderAPI.put(`/orders/${orderId}/status`, { status }),
}; 