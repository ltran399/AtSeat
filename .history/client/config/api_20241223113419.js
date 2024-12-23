import axios from 'axios';

export const API_BASE_URL = "http://localhost:7700/api";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// API functions
export const restaurantAPI = {
    getAll: () => api.get('/restaurants'),
    getById: (id) => api.get(`/restaurants/${id}`),
    create: (data) => api.post('/restaurants', data),
    update: (id, data) => api.put(`/restaurants/${id}`, data),
    delete: (id) => api.delete(`/restaurants/${id}`)
};

export const userAPI = {
    login: (credentials) => api.post('/user/login', credentials),
    register: (userData) => api.post('/user/register', userData)
};

export const adminAPI = {
    login: (credentials) => api.post('/admin/login', credentials),
    register: (userData) => api.post('/admin/register', userData)
};

export default api;