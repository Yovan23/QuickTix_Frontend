// Breakpoints for responsive design
export const BREAKPOINTS = {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
}

// Movie genres
export const GENRES = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
]

// Languages
export const LANGUAGES = [
    'English',
    'Hindi',
    'Tamil',
    'Telugu',
    'Malayalam',
    'Kannada',
    'Bengali',
    'Marathi',
]

// Rating options for filtering (0-5 scale)
export const RATING_OPTIONS = [
    { value: '4.5', label: '4.5+ Rating' },
    { value: '4', label: '4+ Rating' },
    { value: '3.5', label: '3.5+ Rating' },
    { value: '3', label: '3+ Rating' },
    { value: '2', label: '2+ Rating' },
]

// Movie status options for filtering
export const MOVIE_STATUS_OPTIONS = [
    { value: 'RUNNING', label: 'Running' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'ENDED', label: 'Ended' },
]

// Certificate types
export const CERTIFICATES = ['U', 'UA', 'A', 'S']

// Show status
export const SHOW_STATUS = {
    AVAILABLE: 'available',
    FAST_FILLING: 'fast-filling',
    ALMOST_FULL: 'almost-full',
    SOLD_OUT: 'sold-out',
}
