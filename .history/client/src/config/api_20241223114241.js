import axios from 'axios';

export const API_BASE_URL = "http://localhost:7700/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Reservation API endpoints
export const reservationAPI = {
    create: (data) => api.post('/reservations', data),
    getSlots: (restId, date) => api.get(`/reservations/slots/${restId}/${date}`),
    getUserReservations: (userId) => api.get(`/reservations/user/${userId}`),
    getRestaurantReservations: (restId) => api.get(`/reservations/rest/${restId}`),
    delete: (id) => api.delete(`/reservations/${id}`)
};

// Restaurant API endpoints
export const restaurantAPI = {
    getAll: () => api.get('/restaurants'),
    getById: (id) => api.get(`/restaurants/${id}`),
    create: (data) => api.post('/restaurants', data),
    update: (id, data) => api.put(`/restaurants/${id}`, data),
    delete: (id) => api.delete(`/restaurants/${id}`)
};

// User API endpoints
export const userAPI = {
    login: (credentials) => api.post('/user/login', credentials),
    register: (userData) => api.post('/user/register', userData)
};

// Admin API endpoints
export const adminAPI = {
    login: (credentials) => api.post('/admin/login', credentials),
    register: (userData) => api.post('/admin/register', userData)
};

export default api;