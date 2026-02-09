import api from '../index';

/**
 * Theatre Service API
 * Handles theatres, screens, and owner management
 */

// ========== Public Endpoints ==========

/**
 * Get all active theatres
 * @returns {Promise<Array>} List of active theatres
 */
export const getActiveTheatres = async () => {
    const response = await api.get('/theatres/active');
    return response.data;
};

/**
 * Get active theatres by city
 * @param {number|string} cityId - City ID
 * @returns {Promise<Array>} List of theatres in the city
 */
export const getActiveTheatresByCity = async (cityId) => {
    const response = await api.get(`/theatres/active/city/${cityId}`);
    return response.data;
};

/**
 * Get active theatres by owner
 * @param {number|string} ownerId - Owner ID
 * @returns {Promise<Array>} List of owner's active theatres
 */
export const getActiveTheatresByOwner = async (ownerId) => {
    const response = await api.get(`/theatres/active/owner/${ownerId}`);
    return response.data;
};

/**
 * Get active screens by theatre
 * @param {number|string} theatreId - Theatre ID
 * @returns {Promise<Array>} List of active screens
 */
export const getActiveScreensByTheatre = async (theatreId) => {
    const response = await api.get(`/screens/active/theatre/${theatreId}`);
    return response.data;
};

// ========== User Endpoints ==========

/**
 * Register as theatre owner
 * @param {Object} data - Registration data { userId }
 * @returns {Promise<Object>} Theatre owner (status: PENDING)
 */
export const registerAsOwner = async (data) => {
    const response = await api.post('/owners/register', data);
    return response.data;
};

/**
 * Get theatre owner by user ID
 * @param {number|string} userId - User ID
 * @returns {Promise<Object>} Theatre owner record
 */
export const getOwnerByUserId = async (userId) => {
    const response = await api.get(`/owners/user/${userId}`);
    return response.data;
};

// ========== Theatre Owner Endpoints ==========

/**
 * Get owner's theatres
 * @param {number|string} ownerId - Owner ID
 * @returns {Promise<Array>} List of owner's theatres
 */
export const getTheatresByOwner = async (ownerId) => {
    const response = await api.get(`/theatres/owner/${ownerId}`);
    return response.data;
};

/**
 * Update theatre status
 * @param {Object} data - Status update { theatreId, status }
 * @returns {Promise<Object>} Updated theatre
 */
export const updateTheatreStatus = async (data) => {
    const response = await api.put('/theatres/status', data);
    return response.data;
};

/**
 * Get screens by theatre
 * @param {number|string} theatreId - Theatre ID
 * @returns {Promise<Array>} List of screens
 */
export const getScreensByTheatre = async (theatreId) => {
    const response = await api.get(`/screens/theatre/${theatreId}`);
    return response.data;
};

/**
 * Create a new theatre
 * @param {Object} data - Theatre data { ownerId, cityId, name, address }
 * @returns {Promise<Object>} Created theatre
 */
export const createTheatre = async (data) => {
    const response = await api.post('/theatres', data);
    return response.data;
};

/**
 * Delete a theatre
 * @param {number|string} theatreId - Theatre ID
 * @returns {Promise<void>}
 */
export const deleteTheatre = async (theatreId) => {
    const response = await api.delete(`/theatres/${theatreId}`);
    return response.data;
};

/**
 * Add a screen to a theatre
 * @param {Object} data - Screen data { theatreId, name, capacity }
 * @returns {Promise<Object>} Created screen
 */
export const createScreen = async (data) => {
    const response = await api.post('/screens', data);
    return response.data;
};

/**
 * Update screen status
 * @param {Object} data - Status update { screenId, status }
 * @returns {Promise<Object>} Updated screen
 */
export const updateScreenStatus = async (data) => {
    const response = await api.put('/screens/status', data);
    return response.data;
};

// ========== Admin Endpoints ==========

/**
 * Get all theatres (Admin)
 * @returns {Promise<Array>} List of all theatres
 */
export const getAllTheatres = async () => {
    const response = await api.get('/theatres');
    return response.data;
};

/**
 * Get theatres by city (Admin)
 * @param {number|string} cityId - City ID
 * @returns {Promise<Array>} List of theatres in city
 */
export const getTheatresByCity = async (cityId) => {
    const response = await api.get(`/theatres/city/${cityId}`);
    return response.data;
};

/**
 * Get pending owner applications (Admin)
 * @returns {Promise<Array>} List of pending applications
 */
export const getPendingOwners = async () => {
    const response = await api.get('/owners/pending');
    return response.data;
};

/**
 * Approve owner application (Admin)
 * @param {number|string} ownerId - Owner ID
 * @returns {Promise<Object>} Approved owner
 */
export const approveOwner = async (ownerId) => {
    const response = await api.put(`/owners/approve/${ownerId}`);
    return response.data;
};

/**
 * Reject owner application (Admin)
 * @param {number|string} ownerId - Owner ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Rejected owner
 */
export const rejectOwner = async (ownerId, reason) => {
    const response = await api.put(`/owners/reject/${ownerId}`, { reason });
    return response.data;
};
