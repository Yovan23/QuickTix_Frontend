import { useState, useEffect, useCallback } from 'react';
import { getShowById, getSeatAvailability, lockSeats, getLayoutById, unlockSeats } from '@/api/services/showSeatService';
import { getMovieById } from '@/api/services/catalogueService';

/**
 * Hook for managing seat selection flow
 * @param {string|number} movieId - Movie ID
 * @param {string|number} showId - Show ID
 * @returns {Object} Seat selection state and handlers
 */
export function useSeatSelection(movieId, showId) {
    const [movie, setMovie] = useState(null);
    const [show, setShow] = useState(null);
    const [layout, setLayout] = useState(null);
    const [seatAvailability, setSeatAvailability] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locking, setLocking] = useState(false);
    const [lockError, setLockError] = useState(null);
    const [lockTimer, setLockTimer] = useState(null);
    const [sessionId] = useState(() => crypto.randomUUID());

    // Fetch movie, show, and seat availability
    const fetchData = useCallback(async () => {
        if (!movieId || !showId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            console.log('[useSeatSelection] Fetching data for movie:', movieId, 'show:', showId);

            // 1. Fetch Movie, Show, and Availability
            const [movieRes, showRes, availabilityRes] = await Promise.all([
                getMovieById(movieId),
                getShowById(showId),
                getSeatAvailability(showId),
            ]);

            const movieData = movieRes?.data || movieRes;
            const showData = showRes?.data || showRes;
            const availabilityData = availabilityRes?.data || availabilityRes;

            console.log('[useSeatSelection] Movie:', movieData);
            console.log('[useSeatSelection] Show:', showData);
            console.log('[useSeatSelection] Availability:', availabilityData);

            setMovie(movieData);
            setShow(showData);
            setSeatAvailability(availabilityData);

            // 2. Fetch Layout using layoutId from Show
            if (showData.layoutId) {
                console.log('[useSeatSelection] Fetching layout:', showData.layoutId);
                const layoutRes = await getLayoutById(showData.layoutId);
                const layoutData = layoutRes?.data || layoutRes;
                console.log('[useSeatSelection] Layout:', layoutData);
                setLayout(layoutData);
            } else {
                console.warn('[useSeatSelection] Show has no layoutId');
            }

        } catch (err) {
            console.error('[useSeatSelection] Error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load booking data');
        } finally {
            setLoading(false);
        }
    }, [movieId, showId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle seat selection
    const toggleSeat = useCallback((seat) => {
        setSelectedSeats((prev) => {
            const isSelected = prev.some((s) => s.seatNumber === seat.seatNumber);
            if (isSelected) {
                return prev.filter((s) => s.seatNumber !== seat.seatNumber);
            }
            if (prev.length >= 10) {
                return prev; // Max 10 seats
            }
            return [...prev, seat];
        });
    }, []);

    // Clear selection and unlock if needed
    const clearSelection = useCallback(async () => {
        // TODO: Implement unlock API call if needed using sessionId
        setSelectedSeats([]);
        setLockTimer(null);
    }, []);

    // Set selection manually (for state restoration)
    const setSelection = useCallback((seats) => {
        setSelectedSeats(seats);
    }, []);

    // Handle unlock on component unmount
    useEffect(() => {
        return () => {
            // Cleanup on unmount - impossible to do reliable async call here usually
        };
    }, []);

    // Lock selected seats
    const lockSelectedSeats = useCallback(async (userId) => {
        if (selectedSeats.length === 0) return { success: false, error: 'No seats selected' };

        try {
            setLocking(true);
            setLockError(null);

            const lockRequest = {
                showId: String(showId),
                userId: userId,
                sessionId: sessionId,
                seatNumbers: selectedSeats.map(s => s.seatNumber),
            };

            console.log('[useSeatSelection] Locking seats:', lockRequest);
            const result = await lockSeats(lockRequest);
            console.log('[useSeatSelection] Lock result:', result);

            // Start timer from backend duration or default 300s (5 minutes)
            const duration = result.data?.lockDurationSeconds || 300;
            console.log('[useSeatSelection] Lock duration:', duration);
            setLockTimer(duration);

            return { success: true, data: result };
        } catch (err) {
            console.error('[useSeatSelection] Lock error:', err);

            const errorCode = err.response?.data?.errorCode;
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to lock seats';

            // Check for seat conflict errors
            if (errorCode === 'SEAT_ALREADY_LOCKED' || errorCode === 'SEAT_ALREADY_BOOKED') {
                console.log('[useSeatSelection] Seat conflict detected, triggering refresh...');
                setLockError('Some seats were just taken. Refreshing layout...');

                // Clear selection and refresh availability
                setSelectedSeats([]);

                // Trigger refetch after a short delay to allow the error message to show
                setTimeout(() => {
                    fetchData();
                }, 500);

                return {
                    success: false,
                    error: errorMsg,
                    errorCode,
                    shouldRefresh: true
                };
            }

            setLockError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLocking(false);
        }
    }, [selectedSeats, showId, sessionId, fetchData]);

    // Countdown timer effect
    useEffect(() => {
        if (lockTimer === null || lockTimer <= 0) return;

        const interval = setInterval(() => {
            setLockTimer((prev) => {
                if (prev <= 1) {
                    clearSelection();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [lockTimer, clearSelection]);

    // Calculate total price
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);

    return {
        movie,
        show,
        layout,
        seatAvailability,
        selectedSeats,
        totalPrice,
        loading,
        error,
        locking,
        lockError,
        lockTimer,
        sessionId,
        toggleSeat,
        clearSelection,
        setSelection,
        lockSelectedSeats,
        refetch: fetchData,
    };
}
