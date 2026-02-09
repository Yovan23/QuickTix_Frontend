import api from '../index';

/**
 * Generate a unique idempotency key
 * @returns {string} UUID for idempotency
 */
export const generateIdempotencyKey = () => {
    return crypto.randomUUID();
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking details
 * @param {string} bookingData.showId - Show ID
 * @param {number} bookingData.userId - User ID
 * @param {Array<string>} bookingData.seatNumbers - Selected seat numbers
 * @param {number} bookingData.amount - Total amount
 * @param {string} idempotencyKey - Unique key to prevent duplicate bookings
 * @returns {Promise<Object>} Booking response { bookingId, status }
 */
export const createBooking = async (bookingData, idempotencyKey) => {
    const key = idempotencyKey || generateIdempotencyKey();
    console.log('[BookingService] Creating booking with data:', bookingData);
    console.log('[BookingService] Idempotency key:', key);

    try {
        const response = await api.post('/bookings', bookingData, {
            headers: {
                'Idempotency-Key': key,
            },
        });
        console.log('[BookingService] Booking response:', response.data);
        return response.data;
    } catch (error) {
        console.error('[BookingService] Booking API error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Get booking by ID
 * @param {number|string} bookingId - Booking ID
 * @returns {Promise<Object>} Booking details
 */
export const getBookingById = async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
};

/**
 * Get user's bookings
 * @param {number|string} userId - User ID
 * @returns {Promise<Array>} List of user's bookings
 */
export const getUserBookings = async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
};
