import { z } from 'zod';

/**
 * Seat selection validation schema
 */
export const seatSelectionSchema = z.object({
    selectedSeats: z
        .array(z.string())
        .min(1, 'Please select at least one seat')
        .max(10, 'Maximum 10 seats allowed per booking'),
    showId: z.string().min(1, 'Show ID is required'),
    movieId: z.string().min(1, 'Movie ID is required'),
});

/**
 * Payment form validation schema
 */
export const paymentSchema = z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
    amount: z.number().positive('Amount must be positive'),
});

// Export types
export const seatSelectionSchemaType = seatSelectionSchema;
export const paymentSchemaType = paymentSchema;
