import api from '../index';

/**
 * Layout Service API
 * Handles screen layouts for theatre seats
 */

/**
 * Create a new layout for a screen
 * @param {Object} layoutData - Layout data
 * @param {number} layoutData.screenId - Screen ID
 * @param {string} layoutData.layoutName - Layout name
 * @param {Array} layoutData.rows - Array of row objects
 * @param {number} layoutData.totalRows - Total number of rows
 * @param {number} layoutData.totalColumns - Total number of columns
 * @param {number} layoutData.totalSeats - Total number of seats
 * @param {string} layoutData.description - Layout description
 * @param {number} layoutData.createdBy - Owner ID
 * @returns {Promise<Object>} Created layout
 */
export const createLayout = async (layoutData) => {
    const response = await api.post('/layouts', layoutData);
    // Backend wraps in ApiResponse { success, data, message }
    return response.data?.data || response.data;
};

/**
 * Get layouts by screen ID
 * @param {number|string} screenId - Screen ID
 * @returns {Promise<Array>} List of layouts
 */
export const getLayoutsByScreen = async (screenId) => {
    const response = await api.get(`/layouts/screen/${screenId}`);
    return response.data?.data || response.data;
};

/**
 * Get layouts by owner ID (reusable layouts)
 * @param {number|string} ownerId - Owner ID
 * @returns {Promise<Array>} List of layouts created by owner
 */
export const getLayoutsByOwner = async (ownerId) => {
    const response = await api.get(`/layouts/owner/${ownerId}`);
    return response.data?.data || response.data;
};

/**
 * Get all layouts (fallback if owner endpoint not available)
 * @returns {Promise<Array>} List of all layouts
 */
export const getAllLayouts = async () => {
    const response = await api.get('/layouts');
    return response.data?.data || response.data;
};

/**
 * Get layout by ID
 * @param {string} layoutId - Layout ID
 * @returns {Promise<Object>} Layout details
 */
export const getLayoutById = async (layoutId) => {
    const response = await api.get(`/layouts/${layoutId}`);
    return response.data;
};

/**
 * Update layout
 * @param {string} layoutId - Layout ID
 * @param {Object} layoutData - Updated layout data
 * @returns {Promise<Object>} Updated layout
 */
export const updateLayout = async (layoutId, layoutData) => {
    const response = await api.put(`/layouts/${layoutId}`, layoutData);
    return response.data;
};

/**
 * Delete layout
 * @param {string} layoutId - Layout ID
 * @returns {Promise<void>}
 */
export const deleteLayout = async (layoutId) => {
    const response = await api.delete(`/layouts/${layoutId}`);
    return response.data;
};
