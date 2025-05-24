import axios from 'axios';

const createAPI = (baseURL) => {
    return axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const userAPI = createAPI('http://localhost:3001');
export const productAPI = createAPI('http://localhost:3002');
export const cartAPI = createAPI('http://localhost:3003');
export const orderAPI = createAPI('http://localhost:3004'); 