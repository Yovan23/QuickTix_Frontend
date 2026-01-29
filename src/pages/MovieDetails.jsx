import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Star,
    Clock,
    Calendar,
    Globe,
    Award,
    Users,
    Play,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShowCard } from '@/components/shared/ShowCard'
import { getMovieById } from '@/data/movies'
import { getShowsByMovieId } from '@/data/shows'

export function MovieDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const movie = getMovieById(id)
    const allShows = useMemo(() => getShowsByMovieId(id), [id])

    // Get unique dates from shows
    const availableDates = useMemo(() => {
        const dates = [...new Set(allShows.map(show => show.date))]
        return dates.sort()
    }, [allShows])

    const [selectedDate, setSelectedDate] = useState(availableDates[0] || '')

    // Filter shows by selected date
    const filteredShows = useMemo(() => {
        return allShows.filter(show => show.date === selectedDate)
    }, [allShows, selectedDate])

    // Group shows by theater
    const showsByTheater = useMemo(() => {
        const grouped = {}
        filteredShows.forEach(show => {
            if (!grouped[show.theaterName]) {
                grouped[show.theaterName] = {
                    theater: {
                        name: show.theaterName,
                        location: show.theaterLocation,
                    },
                    shows: [],
                }
            }
            grouped[show.theaterName].shows.push(show)
        })
        return Object.values(grouped)
    }, [filteredShows])

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        if (dateString === today.toISOString().split('T')[0]) {
            return 'Today'
        }
        if (dateString === tomorrow.toISOString().split('T')[0]) {
            return 'Tomorrow'
        }
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
    }

    // Format duration
    const formatDuration = (mins) => {
        const hours = Math.floor(mins / 60)
        const minutes = mins % 60
        return `${hours}h ${minutes}m`
    }

    const handleShowSelect = (show) => {
        navigate(`/seat-selection/${id}/${show.id}`)
    }

    if (!movie) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Movie Not Found</h1>
                <p className="text-muted-foreground mb-6">
                    The movie you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section with Backdrop */}
            <section className="relative overflow-hidden">
                {/* Backdrop Image */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${movie.backdrop})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="container relative z-10 py-8 md:py-12">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Movies
                    </Link>

                    {/* Movie Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {/* Poster */}
                        <div className="md:col-span-1">
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 group">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Play overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="p-4 rounded-full bg-primary shadow-lg">
                                        <Play className="h-8 w-8 text-white fill-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Movie Details */}
                        <div className="md:col-span-2 lg:col-span-3">
                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                {movie.title}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                {/* Rating */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-yellow-400">{movie.rating}</span>
                                </div>

                                {/* Duration */}
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDuration(movie.duration)}</span>
                                </div>

                                {/* Certificate */}
                                <Badge variant="outline">{movie.certificate}</Badge>

                                {/* Language */}
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Globe className="h-4 w-4" />
                                    <span>{movie.language}</span>
                                </div>

                                {/* Release Date */}
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {movie.genre.map((g) => (
                                    <Badge key={g} variant="secondary" className="px-3 py-1">
                                        {g}
                                    </Badge>
                                ))}
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-3xl">
                                {movie.description}
                            </p>

                            {/* Cast & Crew */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                {/* Director */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Award className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground block">Director</span>
                                        <span className="font-medium text-foreground">{movie.director}</span>
                                    </div>
                                </div>

                                {/* Cast */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground block">Cast</span>
                                        <span className="font-medium text-foreground">{movie.cast.slice(0, 3).join(', ')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <Button size="xl" className="gap-2 glow-effect">
                                Book Tickets Now
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shows Section */}
            <section className="container py-12 md:py-16">
                <div className="flex items-center gap-3 mb-8">
                    <Calendar className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Select a Show
                    </h2>
                </div>

                {/* Date Selector */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {availableDates.map((date) => (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={cn(
                                "flex-shrink-0 px-6 py-3 rounded-xl border transition-all duration-200",
                                selectedDate === date
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                                    : "bg-card text-foreground border-border hover:border-primary/50"
                            )}
                        >
                            <span className="font-medium">{formatDate(date)}</span>
                        </button>
                    ))}
                </div>

                {/* Shows by Theater */}
                {showsByTheater.length > 0 ? (
                    <div className="space-y-8">
                        {showsByTheater.map(({ theater, shows }) => (
                            <div key={theater.name} className="glass-effect rounded-xl p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-foreground">{theater.name}</h3>
                                    <p className="text-sm text-muted-foreground">{theater.location}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {shows.map((show) => (
                                        <ShowCard
                                            key={show.id}
                                            show={show}
                                            onSelect={handleShowSelect}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 glass-effect rounded-xl">
                        <div className="text-4xl mb-4">🎬</div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Shows Available</h3>
                        <p className="text-muted-foreground">
                            There are no shows available for this date. Please try another date.
                        </p>
                    </div>
                )}
            </section>
        </div>
    )
}
