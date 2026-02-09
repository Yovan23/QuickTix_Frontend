import { useState, useEffect, useCallback, useRef } from 'react';
import {
    getMovies,
    getGenres,
    getLanguages,
    getCities,
    searchMovies,
    getMovieById
} from '@/api/services/catalogueService';

/**
 * Custom hook for fetching catalogue data (movies, genres, languages, cities)
 * with caching, loading states, and request deduplication
 */
export function useCatalogue() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
    });

    // Request deduplication - track current request to avoid duplicates
    const lastMoviesRequestRef = useRef(null);
    const genresFetchedRef = useRef(false);
    const languagesFetchedRef = useRef(false);
    const citiesFetchedRef = useRef(false);

    /**
     * Fetch movies with optional filters
     */
    const fetchMovies = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            console.log('[useCatalogue] Fetching movies with params:', params);
            const response = await getMovies(params);
            console.log('[useCatalogue] Movies response:', response);

            // Handle paginated Spring Boot response format
            // Response structure: { content: [], pageable: {}, totalElements, totalPages, ... }
            if (response && response.content && Array.isArray(response.content)) {
                console.log('[useCatalogue] Found content array with', response.content.length, 'movies');
                setMovies(response.content);
                setPagination({
                    page: response.number || 0,
                    size: response.size || 10,
                    totalPages: response.totalPages || 0,
                    totalElements: response.totalElements || 0,
                });
            } else if (Array.isArray(response)) {
                // Direct array response
                console.log('[useCatalogue] Direct array response with', response.length, 'movies');
                setMovies(response);
            } else if (response && response.data) {
                // Nested data property
                const data = response.data;
                if (data.content && Array.isArray(data.content)) {
                    console.log('[useCatalogue] Nested content array with', data.content.length, 'movies');
                    setMovies(data.content);
                    setPagination({
                        page: data.number || 0,
                        size: data.size || 10,
                        totalPages: data.totalPages || 0,
                        totalElements: data.totalElements || 0,
                    });
                } else if (Array.isArray(data)) {
                    setMovies(data);
                }
            } else {
                console.warn('[useCatalogue] Unexpected response format:', response);
                setMovies([]);
            }
        } catch (err) {
            console.error('[useCatalogue] Failed to fetch movies:', err);
            console.error('[useCatalogue] Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });
            setError(err.response?.data?.message || err.message || 'Failed to fetch movies');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Search movies by query
     */
    const handleSearch = useCallback(async (query, params = {}) => {
        if (!query || query.trim().length === 0) {
            return fetchMovies(params);
        }

        try {
            setLoading(true);
            setError(null);

            console.log('[useCatalogue] Searching movies:', query);
            const response = await searchMovies(query, params);
            console.log('[useCatalogue] Search response:', response);

            if (response && response.content && Array.isArray(response.content)) {
                setMovies(response.content);
                setPagination({
                    page: response.number || 0,
                    size: response.size || 10,
                    totalPages: response.totalPages || 0,
                    totalElements: response.totalElements || 0,
                });
            } else if (Array.isArray(response)) {
                setMovies(response);
            }
        } catch (err) {
            console.error('[useCatalogue] Failed to search movies:', err);
            setError(err.response?.data?.message || 'Failed to search movies');
        } finally {
            setLoading(false);
        }
    }, [fetchMovies]);

    /**
     * Fetch genres (cached - only fetches once)
     */
    const fetchGenres = useCallback(async () => {
        // Skip if already fetched
        if (genresFetchedRef.current && genres.length > 0) {
            console.log('[useCatalogue] Genres already fetched, skipping...');
            return;
        }

        try {
            console.log('[useCatalogue] Fetching genres...');
            const response = await getGenres();
            console.log('[useCatalogue] Genres response:', response);
            genresFetchedRef.current = true;

            if (Array.isArray(response)) {
                setGenres(response);
            } else if (response && response.data && Array.isArray(response.data)) {
                setGenres(response.data);
            } else if (response && response.content && Array.isArray(response.content)) {
                setGenres(response.content);
            }
        } catch (err) {
            console.error('[useCatalogue] Failed to fetch genres:', err);
        }
    }, [genres.length]);

    /**
     * Fetch languages (cached - only fetches once)
     */
    const fetchLanguages = useCallback(async () => {
        // Skip if already fetched
        if (languagesFetchedRef.current && languages.length > 0) {
            console.log('[useCatalogue] Languages already fetched, skipping...');
            return;
        }

        try {
            console.log('[useCatalogue] Fetching languages...');
            const response = await getLanguages();
            console.log('[useCatalogue] Languages response:', response);
            languagesFetchedRef.current = true;

            if (Array.isArray(response)) {
                setLanguages(response);
            } else if (response && response.data && Array.isArray(response.data)) {
                setLanguages(response.data);
            } else if (response && response.content && Array.isArray(response.content)) {
                setLanguages(response.content);
            }
        } catch (err) {
            console.error('[useCatalogue] Failed to fetch languages:', err);
        }
    }, [languages.length]);

    /**
     * Fetch cities
     */
    const fetchCities = useCallback(async () => {
        try {
            console.log('[useCatalogue] Fetching cities...');
            const response = await getCities();
            console.log('[useCatalogue] Cities response:', response);

            if (Array.isArray(response)) {
                setCities(response);
            } else if (response && response.data && Array.isArray(response.data)) {
                setCities(response.data);
            } else if (response && response.content && Array.isArray(response.content)) {
                setCities(response.content);
            }
        } catch (err) {
            console.error('[useCatalogue] Failed to fetch cities:', err);
        }
    }, []);

    /**
     * Fetch all catalogue data on mount
     */
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchMovies(),
                fetchGenres(),
                fetchLanguages(),
                fetchCities(),
            ]);
        } finally {
            setLoading(false);
        }
    }, [fetchMovies, fetchGenres, fetchLanguages, fetchCities]);

    /**
     * Refresh all data
     */
    const refresh = useCallback(() => {
        return fetchAll();
    }, [fetchAll]);

    /**
     * Change page
     */
    const changePage = useCallback((newPage, filters = {}) => {
        return fetchMovies({ ...filters, page: newPage, size: pagination.size });
    }, [fetchMovies, pagination.size]);

    return {
        // Data
        movies,
        genres,
        languages,
        cities,
        pagination,

        // State
        loading,
        error,

        // Actions
        fetchMovies,
        fetchGenres,
        fetchLanguages,
        fetchCities,
        fetchAll,
        refresh,
        handleSearch,
        changePage,

        // Setters
        setMovies,
    };
}

/**
 * Hook for fetching a single movie by ID
 */
export function useMovie(movieId) {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!movieId) {
            setLoading(false);
            return;
        }

        const fetchMovie = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('[useMovie] Fetching movie:', movieId);
                const response = await getMovieById(movieId);
                console.log('[useMovie] Movie response:', response);

                // Handle different response formats
                if (response && response.data) {
                    setMovie(response.data);
                } else {
                    setMovie(response);
                }
            } catch (err) {
                console.error('[useMovie] Failed to fetch movie:', err);
                setError(err.response?.data?.message || 'Failed to fetch movie');
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [movieId]);

    return { movie, loading, error };
}

export default useCatalogue;
