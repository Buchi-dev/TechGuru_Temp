import { productAPI } from './api';

export const productService = {
    createProduct: (productData) => productAPI.post('/products', productData),
    getAllProducts: () => productAPI.get('/products'),
    searchProducts: (searchParams) => {
        const params = new URLSearchParams();
        if (searchParams.query) params.append('query', searchParams.query);
        if (searchParams.category) params.append('category', searchParams.category);
        if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
        if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
        if (searchParams.sellerUsername) params.append('sellerUsername', searchParams.sellerUsername);
        return productAPI.get(`/products/search?${params.toString()}`);
    },
    getProductById: (productId) => productAPI.get(`/products/${productId}`),
    updateProduct: (productId, productData) => productAPI.put(`/products/${productId}`, productData),
    deleteProduct: (productId) => productAPI.delete(`/products/${productId}`),
    getSellerProducts: (sellerId) => productAPI.get(`/products/seller/${sellerId}`),
    getCategories: () => productAPI.get('/products/categories'),
}; 