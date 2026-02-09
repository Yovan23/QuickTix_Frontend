import api from '../index';


/**
 * Payment Service API
 * Handles payment initiation and status
 */

/**
 * Initiate a payment
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.bookingId - Booking ID
 * @param {number} paymentData.userId - User ID
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.currency - Currency code (default: INR)
 * @param {string} paymentData.paymentMethod - Payment method (optional)
 * @param {string} idempotencyKey - Unique key to prevent duplicate payments
 * @returns {Promise<Object>} Payment response { razorpayOrderId, amount, currency, keyId }
 */
export const initiatePayment = async (paymentData, idempotencyKey) => {
    const response = await api.post('/payments/initiate', paymentData, {
        headers: {
            'Idempotency-Key': idempotencyKey || crypto.randomUUID(),
        },
    });
    return response.data;
};

/**
 * Get payment details by ID
 * @param {number|string} paymentId - Payment ID
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentById = async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
};

/**
 * Get payments by booking ID
 * @param {number|string} bookingId - Booking ID
 * @returns {Promise<Array>} List of payments for booking
 */
export const getPaymentsByBooking = async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
};

/**
 * Verify payment
 * @param {Object} paymentData
 * @param {string} paymentData.razorpayOrderId
 * @param {string} paymentData.razorpayPaymentId
 * @param {string} paymentData.razorpaySignature
 * @returns {Promise<Object>} Verification response
 */
export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
};

/**
 * Notify backend of payment failure or cancellation
 * @param {Object} data
 * @param {number} data.bookingId - Booking ID
 * @param {string} data.failureReason - Reason for failure
 * @returns {Promise<Object>} Failure acknowledgment
 */
export const failPayment = async (data) => {
    const response = await api.post('/payments/fail', data);
    return response.data;
};

/**
 * Load Razorpay SDK dynamically
 * @returns {Promise<Object>} Razorpay constructor
 */
export const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(window.Razorpay);
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.body.appendChild(script);
    });
};

/**
 * Open Razorpay checkout
 * @param {Object} options - Razorpay options
 * @param {string} options.orderId - Razorpay order ID
 * @param {number} options.amount - Amount in paise
 * @param {string} options.currency - Currency code
 * @param {string} options.name - Business name
 * @param {string} options.description - Payment description
 * @param {Object} options.prefill - Prefill data { name, email, contact }
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 */
export const openRazorpayCheckout = async (options) => {
    const Razorpay = await loadRazorpayScript();

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log('[Razorpay] Key ID:', razorpayKey ? razorpayKey.substring(0, 10) + '...' : 'NOT FOUND');
    console.log('[Razorpay] Order ID:', options.orderId);
    console.log('[Razorpay] Amount:', options.amount);

    if (!razorpayKey) {
        console.error('[Razorpay] FATAL: VITE_RAZORPAY_KEY_ID is not set!');
        if (options.onFailure) {
            options.onFailure({ error: 'Razorpay key not configured' });
        }
        return;
    }

    const rzp = new Razorpay({
        key: razorpayKey,
        order_id: options.orderId,
        amount: options.amount,
        currency: options.currency || 'INR',
        name: options.name || import.meta.env.VITE_APP_NAME || 'QuickTix',
        description: options.description || 'Movie Ticket Booking',
        prefill: options.prefill || {},
        theme: {
            color: '#E50914',
        },
        handler: (response) => {
            if (options.onSuccess) {
                options.onSuccess(response);
            }
        },
        modal: {
            ondismiss: () => {
                if (options.onFailure) {
                    options.onFailure({ error: 'Payment cancelled' });
                }
            },
        },
    });

    rzp.on('payment.failed', (response) => {
        if (options.onFailure) {
            options.onFailure(response.error);
        }
    });

    rzp.open();
};
