import api from '../index';

/**
 * ShowSeat Service API
 * Handles shows, seats, and seat locking
 */

/**
 * Get shows by movie ID
 * @param {number|string} movieId - Movie ID
 * @returns {Promise<Array>} List of shows
 */
export const getShowsByMovie = async (movieId) => {
    const response = await api.get(`/api/shows/movie/${movieId}`);
    return response.data;
};

/**
 * Get shows by theatre ID
 * @param {number|string} theatreId - Theatre ID
 * @returns {Promise<Array>} List of shows
 */
export const getShowsByTheatre = async (theatreId) => {
    const response = await api.get(`/api/shows/theatre/${theatreId}`);
    return response.data;
};

/**
 * Get show details by ID
 * @param {number|string} showId - Show ID
 * @returns {Promise<Object>} Show details
 */
export const getShowById = async (showId) => {
    const response = await api.get(`/api/shows/${showId}`);
    return response.data;
};

/**
 * Get seat availability for a show
 * @param {number|string} showId - Show ID
 * @returns {Promise<Object>} Seat availability map { showId, seatMap }
 */
export const getSeatAvailability = async (showId) => {
    const response = await api.get(`/seat-availability/show/${showId}`);
    return response.data;
};

/**
 * Lock seats for booking
 * @param {Object} lockRequest - Lock request data
 * @param {string} lockRequest.showId - Show ID
 * @param {number} lockRequest.userId - User ID
 * @param {string} lockRequest.sessionId - Session ID (UUID)
 * @param {Array<string>} lockRequest.seatNumbers - Seat numbers to lock
 * @returns {Promise<Object>} Lock response
 */
export const lockSeats = async (lockRequest) => {
    const response = await api.post('/seats/lock', lockRequest);
    return response.data;
};

/**
 * Create a new show (Theatre Owner/Admin)
 * @param {Object} showData - Show data matching CreateShowRequest DTO
 * @param {number} showData.movieId - Movie ID (owner selects)
 * @param {number} showData.theatreId - Theatre ID
 * @param {number} showData.screenId - Screen ID
 * @param {string} showData.layoutId - Layout ID from MongoDB
 * @param {string} showData.startTime - Show start time (ISO format)
 * @param {string} showData.endTime - Show end time (ISO format)
 * @param {Object} showData.pricing - Pricing per seat type
 * @param {string} showData.pricing.silver - Silver seat price
 * @param {string} showData.pricing.gold - Gold seat price
 * @param {string} showData.pricing.platinum - Platinum seat price
 * @param {string} showData.pricing.diamond - Diamond seat price
 * @param {string} showData.language - Show language
 * @param {string} showData.format - Show format (2D/3D/IMAX)
 * @param {string} showData.notes - Additional notes
 * @returns {Promise<Object>} Created show
 */
export const createShow = async (showData) => {
    const response = await api.post('/api/shows', showData);
    return response.data;
};

/**
 * Get shows by screen ID
 * @param {number|string} screenId - Screen ID
 * @returns {Promise<Array>} List of shows
 */
export const getShowsByScreen = async (screenId) => {
    const response = await api.get(`/api/shows/screen/${screenId}`);
    return response.data;
};

/**
 * Update show
 * @param {number|string} showId - Show ID
 * @param {Object} showData - Updated show data
 * @returns {Promise<Object>} Updated show
 */
export const updateShow = async (showId, showData) => {
    const response = await api.put(`/api/shows/${showId}`, showData);
    return response.data;
};

export const deleteShow = async (showId) => {
    const response = await api.delete(`/api/shows/${showId}`);
    return response.data;
};

/**
 * Get layout details by ID
 * @param {string} layoutId - Layout ID
 * @returns {Promise<Object>} Layout details
 */
export const getLayoutById = async (layoutId) => {
    // Note: The endpoint is /layouts/{layoutId} based on SeatLayoutController
    const response = await api.get(`/layouts/${layoutId}`);
    return response.data;
};

/**
 * Confirm booked seats
 * @param {Object} confirmRequest - Confirm request data
 * @param {string} confirmRequest.showId - Show ID
 * @param {number|string} confirmRequest.bookingId - Booking ID
 * @param {number} confirmRequest.userId - User ID
 * @param {string} confirmRequest.sessionId - Session ID
 * @param {Array<string>} confirmRequest.seatNumbers - Seat numbers to confirm
 * @returns {Promise<void>}
 */
export const confirmSeats = async (confirmRequest) => {
    const response = await api.post('/seats/confirm', confirmRequest);
    return response.data;
};

/**
 * Unlock seats (release lock)
 * @param {Object} unlockRequest - Unlock request data
 * @param {string} unlockRequest.showId - Show ID
 * @param {number} unlockRequest.userId - User ID
 * @param {string} unlockRequest.sessionId - Session ID
 * @param {Array<string>} unlockRequest.seatNumbers - Seat numbers to unlock
 * @returns {Promise<void>}
 */
export const unlockSeats = async (unlockRequest) => {
    const response = await api.post('/seats/unlock', unlockRequest);
    return response.data;
};
