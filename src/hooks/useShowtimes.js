import { useState, useEffect, useCallback } from 'react';
import { getShowsByMovie } from '@/api/services/showSeatService';

/**
 * Hook for fetching showtimes for a movie
 * @param {string|number} movieId - Movie ID
 * @returns {Object} { shows, loading, error, refetch }
 */
export function useShowtimes(movieId) {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchShows = useCallback(async () => {
        if (!movieId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            console.log('[useShowtimes] Fetching shows for movie:', movieId);

            const data = await getShowsByMovie(movieId);
            console.log('[useShowtimes] Shows data:', data);

            // Handle response format - could be array or paginated
            const showsList = Array.isArray(data) ? data : (data.content || []);
            setShows(showsList);
        } catch (err) {
            console.error('[useShowtimes] Error:', err);
            // Don't treat 404 as error for new movies with no shows
            if (err.response?.status === 404) {
                setShows([]);
            } else {
                setError(err.response?.data?.message || err.message || 'Failed to fetch shows');
            }
        } finally {
            setLoading(false);
        }
    }, [movieId]);

    useEffect(() => {
        fetchShows();
    }, [fetchShows]);

    return {
        shows,
        loading,
        error,
        refetch: fetchShows,
    };
}
