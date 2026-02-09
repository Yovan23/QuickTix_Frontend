import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    Sparkles,
    Film,
    Star,
    TrendingUp,
    Ticket,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MovieGrid } from '@/components/shared/MovieGrid'
import { FilterBar } from '@/components/shared/FilterBar'
import { useCatalogue } from '@/hooks/useCatalogue'

export function Home() {
    const [filters, setFilters] = useState({
        genre: '',
        language: '',
        rating: '',
        status: 'RUNNING',  // Default to running movies
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(0)

    // Fetch movies and filters from API
    const {
        movies,
        genres,
        languages,
        loading,
        error,
        fetchMovies,
        fetchGenres,
        fetchLanguages,
        handleSearch,
        pagination
    } = useCatalogue()

    // Fetch filter options on mount (genres and languages only)
    // Movies are fetched by the filter useEffect below with default filters
    useEffect(() => {
        fetchGenres()
        fetchLanguages()
    }, [fetchGenres, fetchLanguages])

    // Handle filter changes - use backend API for genre, language, and status
    useEffect(() => {
        // Reset to page 0 when filters change
        setCurrentPage(0)
        const params = { page: 0, size: 15 }
        if (filters.genre) params.genreId = filters.genre
        if (filters.language) params.languageId = filters.language
        if (filters.status) params.status = filters.status

        console.log('[Home] Fetching movies with params:', params)
        fetchMovies(params)
    }, [filters.genre, filters.language, filters.status, fetchMovies])

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        const params = { page: newPage, size: 15 }
        if (filters.genre) params.genreId = filters.genre
        if (filters.language) params.languageId = filters.language
        if (filters.status) params.status = filters.status
        fetchMovies(params)
        // Scroll to top of movies section
        document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })
    }

    // Handle search with debounce
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery) {
                handleSearch(searchQuery)
            } else {
                // Re-apply filters when clearing search
                const params = { page: currentPage, size: 15 }
                if (filters.genre) params.genreId = filters.genre
                if (filters.language) params.languageId = filters.language
                if (filters.status) params.status = filters.status
                fetchMovies(params)
            }
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [searchQuery, handleSearch, fetchMovies, filters.genre, filters.language, filters.status, currentPage])

    // Filter movies locally by rating only (backend handles status now)
    const filteredMovies = useMemo(() => {
        if (!movies || !Array.isArray(movies)) return []

        let result = [...movies]

        // Only rating filter is done client-side
        if (filters.rating) {
            const minRating = parseFloat(filters.rating)
            result = result.filter((movie) => (movie.rating || 0) >= minRating)
        }

        return result
    }, [movies, filters.rating])

    // Get featured movie (highest rated or first movie)
    const featuredMovie = useMemo(() => {
        if (!filteredMovies.length) return null
        return [...filteredMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
    }, [filteredMovies])

    const handleClearFilters = () => {
        setFilters({ genre: '', language: '', rating: '', status: '' })
        setSearchQuery('')
    }

    // Loading state
    if (loading && !movies.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading movies...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error && !movies.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 max-w-md text-center">
                    <div className="p-4 rounded-full bg-destructive/10">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Failed to load movies</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={() => fetchAll()} className="gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    {featuredMovie && (
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30"
                            style={{
                                backgroundImage: featuredMovie.backgroundUrl
                                    ? `url(${featuredMovie.backgroundUrl})`
                                    : featuredMovie.posterUrl
                                        ? `url(${featuredMovie.posterUrl})`
                                        : 'none'
                            }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
                </div>

                {/* Content */}
                <div className="container relative z-10 py-16 md:py-24 lg:py-32">
                    <div className="max-w-3xl">
                        {/* Tag */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Now Showing</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in animation-delay-100">
                            Book Your{' '}
                            <span className="text-gradient">Movie Experience</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in animation-delay-200">
                            Discover the latest blockbusters, timeless classics, and hidden gems.
                            Book your tickets in seconds and enjoy cinema like never before.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-300">
                            <Button size="xl" className="gap-2 glow-effect" asChild>
                                <a href="#movies">
                                    <Ticket className="h-5 w-5" />
                                    Browse Movies
                                    <ArrowRight className="h-5 w-5" />
                                </a>
                            </Button>
                            {featuredMovie && (
                                <Link to={`/movie/${featuredMovie.id}`}>
                                    <Button size="xl" variant="outline" className="gap-2 w-full sm:w-auto">
                                        <Film className="h-5 w-5" />
                                        Featured: {featuredMovie.title}
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10 animate-fade-in animation-delay-400">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Film className="h-5 w-5 text-primary" />
                                    <span className="text-2xl font-bold text-foreground">
                                        {movies.length}+
                                    </span>
                                </div>
                                <span className="text-sm text-muted-foreground">Movies Available</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <span className="text-2xl font-bold text-foreground">8.5</span>
                                </div>
                                <span className="text-sm text-muted-foreground">Avg. Rating</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                    <span className="text-2xl font-bold text-foreground">50K+</span>
                                </div>
                                <span className="text-sm text-muted-foreground">Tickets Booked</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-[120px] opacity-50" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[120px] opacity-50" />
            </section>

            {/* Movies Section */}
            <section id="movies" className="container py-12 md:py-16">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            Now Showing
                        </h2>
                        <p className="text-muted-foreground">
                            {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} available
                        </p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="mb-8">
                    <FilterBar
                        filters={filters}
                        onFilterChange={setFilters}
                        onClearFilters={handleClearFilters}
                        genres={genres}
                        languages={languages}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                </div>

                {/* Loading indicator for filter changes */}
                {loading && movies.length > 0 && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                )}

                {/* Movie Grid */}
                <MovieGrid movies={filteredMovies} />

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0 || loading}
                            className="gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-2">
                            {/* Generate page buttons */}
                            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                // Show pages around current page
                                let pageNum;
                                if (pagination.totalPages <= 5) {
                                    pageNum = i;
                                } else if (currentPage < 3) {
                                    pageNum = i;
                                } else if (currentPage > pagination.totalPages - 4) {
                                    pageNum = pagination.totalPages - 5 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum)}
                                        disabled={loading}
                                        className="w-10"
                                    >
                                        {pageNum + 1}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= pagination.totalPages - 1 || loading}
                            className="gap-1"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <span className="text-sm text-muted-foreground ml-4">
                            Page {currentPage + 1} of {pagination.totalPages}
                            {pagination.totalElements > 0 && ` (${pagination.totalElements} movies)`}
                        </span>
                    </div>
                )}

                {/* Empty state */}
                {!loading && filteredMovies.length === 0 && (
                    <div className="text-center py-12">
                        <Film className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">No movies found</h3>
                        <p className="text-muted-foreground mb-4">
                            Try adjusting your filters or search query
                        </p>
                        <Button onClick={handleClearFilters} variant="outline">
                            Clear Filters
                        </Button>
                    </div>
                )}
            </section>
        </div>
    )
}
