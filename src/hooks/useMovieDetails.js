import { useState, useEffect, useCallback } from 'react';
import { getMovieById } from '@/api/services/catalogueService';

/**
 * Hook for fetching movie details by ID
 * @param {string|number} movieId - Movie ID to fetch
 * @returns {Object} { movie, loading, error, refetch }
 */
export function useMovieDetails(movieId) {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMovie = useCallback(async () => {
        if (!movieId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            console.log('[useMovieDetails] Fetching movie:', movieId);

            const data = await getMovieById(movieId);
            console.log('[useMovieDetails] Movie data:', data);

            setMovie(data);
        } catch (err) {
            console.error('[useMovieDetails] Error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch movie');
        } finally {
            setLoading(false);
        }
    }, [movieId]);

    useEffect(() => {
        fetchMovie();
    }, [fetchMovie]);

    return {
        movie,
        loading,
        error,
        refetch: fetchMovie,
    };
}
