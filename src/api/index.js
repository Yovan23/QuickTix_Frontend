import axios from 'axios';

/**
 * Axios instance configured with base URL and interceptors
 * for JWT authentication and error handling
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        // Always add ngrok header to skip browser warning page
        'ngrok-skip-browser-warning': 'true',
    },
});

// Log the base URL on initialization
console.log('[API] Base URL:', import.meta.env.VITE_API_BASE_URL);

/**
 * Request interceptor - adds JWT token and X-User-Id to all requests
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add X-User-Id header from stored user data (required by backend controllers)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData.userId) {
                    config.headers['X-User-Id'] = userData.userId;
                }
            } catch (e) {
                console.warn('[API] Failed to parse stored user for X-User-Id header');
            }
        }

        if (import.meta.env.DEV) {
            console.log('[API] Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - handles token refresh and errors
 */
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log('[API] Response:', response.status, response.config.url);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        console.error('[API] Response error:', {
            url: originalRequest?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
        });

        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear token and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');

            // Optionally redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        // Handle 403 Forbidden - insufficient permissions
        if (error.response?.status === 403) {
            if (typeof window !== 'undefined') {
                window.location.href = '/unauthorized';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
