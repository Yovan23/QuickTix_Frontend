import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    Sparkles,
    Film,
    Star,
    TrendingUp,
    Ticket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MovieGrid } from '@/components/shared/MovieGrid'
import { FilterBar } from '@/components/shared/FilterBar'
import { movies, filterMovies } from '@/data/movies'

export function Home() {
    const [filters, setFilters] = useState({
        genre: '',
        language: '',
        rating: '',
    })

    // Filter movies based on current filters
    const filteredMovies = useMemo(() => {
        return filterMovies(filters)
    }, [filters])

    // Get featured movie (highest rated)
    const featuredMovie = useMemo(() => {
        return [...movies].sort((a, b) => b.rating - a.rating)[0]
    }, [])

    const handleClearFilters = () => {
        setFilters({ genre: '', language: '', rating: '' })
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{ backgroundImage: `url(${featuredMovie.backdrop})` }}
                    />
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
                            <Button size="xl" className="gap-2 glow-effect">
                                <Ticket className="h-5 w-5" />
                                Browse Movies
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                            <Link to={`/movie/${featuredMovie.id}`}>
                                <Button size="xl" variant="outline" className="gap-2 w-full sm:w-auto">
                                    <Film className="h-5 w-5" />
                                    Featured: {featuredMovie.title}
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10 animate-fade-in animation-delay-400">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Film className="h-5 w-5 text-primary" />
                                    <span className="text-2xl font-bold text-foreground">{movies.length}+</span>
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
                    />
                </div>

                {/* Movie Grid */}
                <MovieGrid movies={filteredMovies} />
            </section>

            {/* Coming Soon Teaser */}
            <section className="container pb-12 md:pb-16">
                <div className="glass-effect rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/10" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-500">Premium Access</span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                            Unlock Exclusive Rewards
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                            Join QuickTix Premium. Get 20% off your first 3 bookings, free popcorn upgrades,
                            and early access to ticket sales.
                        </p>

                        <Button size="lg" className="gap-2 glow-effect">
                            Join Premium Now
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
