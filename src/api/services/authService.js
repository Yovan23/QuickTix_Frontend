import api from '../index';

/**
 * Identity Service API
 * Handles authentication, registration, and user management
 */

/**
 * Register a new user
 * @param {Object} data - Registration data
 * @param {string} data.name - User's full name
 * @param {string} data.email - User's email
 * @param {string} data.password - User's password
 * @param {string} data.phone - User's phone number
 * @returns {Promise<string>} Success message
 */
export const register = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Token and user info { token, userId, roles }
 */
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

/**
 * Add role to user (Admin only)
 * @param {number|string} userId - User ID
 * @param {string} roleName - Role name (e.g., 'THEATRE_OWNER')
 * @returns {Promise<string>} Success message
 */
export const addRoleToUser = async (userId, roleName) => {
    const response = await api.put(`/auth/user/${userId}/role`, null, {
        params: { roleName },
    });
    return response.data;
};

/**
 * Parse JWT token to extract user info
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const parseToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to parse token:', error);
        return null;
    }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
    const decoded = parseToken(token);
    if (!decoded || !decoded.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
};

/**
 * Get user info from stored token
 * @returns {Object|null} User info or null if not logged in
 */
export const getCurrentUser = () => {
    const token = localStorage.getItem('accessToken');
    if (!token || isTokenExpired(token)) {
        return null;
    }
    return parseToken(token);
};
