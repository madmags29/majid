import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
// Ensure we target the /admin subpath for all admin dashboard API calls
const API_URL = `${BASE_URL.replace(/\/$/, '')}/admin`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the admin token
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle unauthorized errors
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
        if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
        }
    }
    return Promise.reject(error);
});

export default api;
