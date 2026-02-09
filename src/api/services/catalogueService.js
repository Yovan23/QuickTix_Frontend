import api from '../index';

/**
 * Catalogue Service API
 * Handles movies, cities, genres, and languages
 */

/**
 * Get all movies with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 0)
 * @param {number} params.size - Page size (default: 10)
 * @param {number} params.genreId - Filter by genre ID
 * @param {number} params.languageId - Filter by language ID
 * @param {string} params.status - Filter by status (RUNNING, UPCOMING, ENDED)
 * @returns {Promise<Object>} Paginated movie response
 */
export const getMovies = async (params = {}) => {
    const response = await api.get('/movies', { params });
    return response.data;
};

/**
 * Get movie details by ID
 * @param {number|string} id - Movie ID
 * @returns {Promise<Object>} Movie details
 */
export const getMovieById = async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
};

/**
 * Search movies by query
 * @param {string} query - Search query
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Search results
 */
export const searchMovies = async (query, params = {}) => {
    const response = await api.get('/movies/search', {
        params: { query, ...params }
    });
    return response.data;
};

/**
 * Get upcoming movies
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Upcoming movies
 */
export const getUpcomingMovies = async (params = {}) => {
    const response = await api.get('/movies/upcoming', { params });
    return response.data;
};

/**
 * Get all cities
 * @returns {Promise<Array>} List of cities
 */
export const getCities = async () => {
    const response = await api.get('/cities');
    return response.data;
};

/**
 * Get city by ID
 * @param {number|string} id - City ID
 * @returns {Promise<Object>} City details
 */
export const getCityById = async (id) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
};

/**
 * Get all languages
 * @returns {Promise<Array>} List of languages
 */
export const getLanguages = async () => {
    const response = await api.get('/languages');
    return response.data;
};

/**
 * Get movies by language
 * @param {number|string} languageId - Language ID
 * @returns {Promise<Array>} Movies in the language
 */
export const getMoviesByLanguage = async (languageId) => {
    const response = await api.get(`/languages/${languageId}/movies`);
    return response.data;
};

/**
 * Get all genres
 * @returns {Promise<Array>} List of genres
 */
export const getGenres = async () => {
    const response = await api.get('/genres');
    return response.data;
};

/**
 * Get movies by genre
 * @param {number|string} genreId - Genre ID
 * @returns {Promise<Array>} Movies in the genre
 */
export const getMoviesByGenre = async (genreId) => {
    const response = await api.get(`/genres/${genreId}/movies`);
    return response.data;
};

// Admin endpoints (require ADMIN role)

/**
 * Create a new movie (Admin only)
 * @param {FormData} formData - Movie data with poster and background images
 * @returns {Promise<Object>} Created movie
 */
export const createMovie = async (formData) => {
    const response = await api.post('/movies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/**
 * Update a movie (Admin only)
 * @param {number|string} id - Movie ID
 * @param {FormData} formData - Updated movie data
 * @returns {Promise<Object>} Updated movie
 */
export const updateMovie = async (id, formData) => {
    const response = await api.put(`/movies/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/**
 * Delete a movie (Admin only)
 * @param {number|string} id - Movie ID
 * @returns {Promise<void>}
 */
export const deleteMovie = async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
};

/**
 * Create a new city (Admin only)
 * @param {Object} data - City data { name, state, country }
 * @returns {Promise<Object>} Created city
 */
export const createCity = async (data) => {
    const response = await api.post('/cities', data);
    return response.data;
};

/**
 * Create a new language (Admin only)
 * @param {string} name - Language name
 * @param {string} code - Language code
 * @returns {Promise<Object>} Created language
 */
export const createLanguage = async (name, code) => {
    const response = await api.post('/languages', null, {
        params: { name, code },
    });
    return response.data;
};

/**
 * Create a new genre (Admin only)
 * @param {string} name - Genre name
 * @returns {Promise<Object>} Created genre
 */
export const createGenre = async (name) => {
    const response = await api.post('/genres', null, {
        params: { name },
    });
    return response.data;
};

/**
 * Update a city (Admin only)
 * @param {number|string} id - City ID
 * @param {Object} data - City data { name, state, country }
 * @returns {Promise<Object>} Updated city
 */
export const updateCity = async (id, data) => {
    const response = await api.put(`/cities/${id}`, data);
    return response.data;
};

/**
 * Delete a city (Admin only)
 * @param {number|string} id - City ID
 * @returns {Promise<void>}
 */
export const deleteCity = async (id) => {
    const response = await api.delete(`/cities/${id}`);
    return response.data;
};

/**
 * Update a language (Admin only)
 * @param {number|string} id - Language ID
 * @param {string} name - Language name
 * @param {string} code - Language code
 * @returns {Promise<Object>} Updated language
 */
export const updateLanguage = async (id, name, code) => {
    const response = await api.put(`/languages/${id}`, null, {
        params: { name, code },
    });
    return response.data;
};

/**
 * Delete a language (Admin only)
 * @param {number|string} id - Language ID
 * @returns {Promise<void>}
 */
export const deleteLanguage = async (id) => {
    const response = await api.delete(`/languages/${id}`);
    return response.data;
};

/**
 * Update a genre (Admin only)
 * @param {number|string} id - Genre ID
 * @param {string} name - Genre name
 * @returns {Promise<Object>} Updated genre
 */
export const updateGenre = async (id, name) => {
    const response = await api.put(`/genres/${id}`, null, {
        params: { name },
    });
    return response.data;
};

/**
 * Delete a genre (Admin only)
 * @param {number|string} id - Genre ID
 * @returns {Promise<void>}
 */
export const deleteGenre = async (id) => {
    const response = await api.delete(`/genres/${id}`);
    return response.data;
};
