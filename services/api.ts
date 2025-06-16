import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token if present
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('admin_jwt');
            console.log(token)
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global error handler (optional: customize as needed)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can add global error handling here
        // For now, just throw the error
        return Promise.reject(error);
    }
);

export default api; 