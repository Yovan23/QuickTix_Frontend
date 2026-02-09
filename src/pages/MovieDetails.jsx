import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Star,
    Clock,
    Calendar,
    Globe,
    Award,
    Users,
    Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShowCard } from '@/components/shared/ShowCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import { useShowtimes } from '@/hooks/useShowtimes';
import { getActiveTheatres } from '@/api/services/theatreService';

export function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Fetch movie and shows from API
    const { movie, loading: movieLoading, error: movieError, refetch: refetchMovie } = useMovieDetails(id);
    const { shows: allShows, loading: showsLoading, error: showsError } = useShowtimes(id);

    // Fetch theatres for name lookup
    const [theatresMap, setTheatresMap] = useState({});

    useEffect(() => {
        const loadTheatres = async () => {
            try {
                const theatres = await getActiveTheatres();
                const map = {};
                if (Array.isArray(theatres)) {
                    theatres.forEach(t => {
                        // Handle potential ID field variations
                        const id = t.theatreId || t.id;
                        if (id) map[id] = t;
                    });
                }
                setTheatresMap(map);
            } catch (err) {
                console.error("Failed to load theatres", err);
            }
        };
        loadTheatres();
    }, []);

    // Get unique dates from shows
    const availableDates = useMemo(() => {
        if (!allShows?.length) return [];
        const dates = [...new Set(allShows.map(show => {
            // Handle different date formats
            const showTime = show.startTime || show.showTime || show.date;
            if (!showTime) return null;
            return showTime.split('T')[0];
        }).filter(Boolean))];
        return dates.sort();
    }, [allShows]);

    const [selectedDate, setSelectedDate] = useState('');

    // Set initial date when available
    useMemo(() => {
        if (availableDates.length > 0 && !selectedDate) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates, selectedDate]);

    // Filter shows by selected date
    const filteredShows = useMemo(() => {
        if (!selectedDate || !allShows?.length) return [];
        return allShows.filter(show => {
            const showTime = show.startTime || show.showTime || show.date;
            return showTime && showTime.startsWith(selectedDate);
        });
    }, [allShows, selectedDate]);

    // Group shows by theater
    const showsByTheater = useMemo(() => {
        if (Object.keys(theatresMap).length > 0) {
            console.log('[MovieDetails] Theatres Map:', theatresMap);
        }

        const grouped = {};
        filteredShows.forEach(show => {
            // Try to resolve theatre name from show object first, then fallback to map
            const theatreId = show.theatreId || show.theaterId;
            const mappedTheatre = theatresMap[theatreId];

            // Debug matching if name is missing
            if ((!show.theatreName && !show.theaterName) && !mappedTheatre) {
                console.warn(`[MovieDetails] Missing theatre info for show ${show.showId}, theatreId: ${theatreId}`);
            }

            const theaterName = show.theatreName || show.theaterName || mappedTheatre?.name || 'Unknown Theater';
            const theaterLocation = show.theatreLocation || show.theaterLocation || mappedTheatre?.address || mappedTheatre?.location || '';

            if (!grouped[theaterName]) {
                grouped[theaterName] = {
                    theater: {
                        name: theaterName,
                        location: theaterLocation,
                    },
                    shows: [],
                };
            }
            grouped[theaterName].shows.push(show);
        });
        return Object.values(grouped);
    }, [filteredShows, theatresMap]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayStr = today.toISOString().split('T')[0];
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        if (dateString === todayStr) return 'Today';
        if (dateString === tomorrowStr) return 'Tomorrow';

        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format duration
    const formatDuration = (mins) => {
        if (!mins) return '';
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return `${hours}h ${minutes}m`;
    };

    const handleShowSelect = (show) => {
        navigate(`/seat-selection/${id}/${show.showId || show.id}`);
    };

    // Loading state
    if (movieLoading) {
        return <LoadingSpinner fullScreen text="Loading movie details..." size="lg" />;
    }

    // Error state
    if (movieError) {
        return (
            <ErrorMessage
                fullScreen
                title="Failed to load movie"
                message={movieError}
                onRetry={refetchMovie}
            />
        );
    }

    // Not found state
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
        );
    }

    // Helper to get movie properties (handle different API response formats)
    const posterUrl = movie.posterUrl || movie.poster || '/placeholder-movie.jpg';
    const backdropUrl = movie.backgroundUrl || movie.backdrop || posterUrl;
    const movieTitle = movie.title || movie.name;
    const movieRating = movie.rating || movie.imdbRating || 0;
    const movieDuration = movie.durationMinutes || movie.duration || 0;
    const movieDescription = movie.description || movie.synopsis || movie.overview || '';
    const movieGenres = movie.genres || movie.genre || [];
    const movieLanguages = movie.languages || (movie.language ? [movie.language] : []);
    const movieCertificate = movie.certificate || movie.certification || 'UA';
    const movieReleaseDate = movie.releaseDate || movie.releasedOn;
    const movieDirector = movie.director || 'N/A';
    const movieCast = movie.cast || [];
    const movieCrew = movie.crew || [];

    return (
        <div className="min-h-screen">
            {/* Hero Section with Backdrop */}
            <section className="relative overflow-hidden">
                {/* Backdrop Image */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${backdropUrl})` }}
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
                                    src={posterUrl}
                                    alt={movieTitle}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-movie.jpg';
                                    }}
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
                                {movieTitle}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                {/* Rating - out of 5 */}
                                {movieRating > 0 && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-semibold text-yellow-400">{movieRating}</span>
                                        <span className="text-xs text-yellow-400/70">/5</span>
                                    </div>
                                )}

                                {/* Duration */}
                                {movieDuration > 0 && (
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{formatDuration(movieDuration)}</span>
                                    </div>
                                )}

                                {/* Certificate */}
                                <Badge variant="outline">{movieCertificate}</Badge>

                                {/* Languages */}
                                {movieLanguages.length > 0 && (
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Globe className="h-4 w-4" />
                                        <span>
                                            {movieLanguages.map(l =>
                                                typeof l === 'string' ? l : l.name
                                            ).join(', ')}
                                        </span>
                                    </div>
                                )}

                                {/* Release Date */}
                                {movieReleaseDate && (
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(movieReleaseDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                )}
                            </div>

                            {/* Genres */}
                            {movieGenres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {movieGenres.map((g, idx) => (
                                        <Badge key={idx} variant="secondary" className="px-3 py-1">
                                            {typeof g === 'string' ? g : g.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Description */}
                            {movieDescription && (
                                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-3xl">
                                    {movieDescription}
                                </p>
                            )}

                            {/* Cast & Crew */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                {/* Director */}
                                {movieDirector && movieDirector !== 'N/A' && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Award className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground block">Director</span>
                                            <span className="font-medium text-foreground">{movieDirector}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Cast */}
                                {movieCast.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground block">Cast</span>
                                            <span className="font-medium text-foreground">
                                                {movieCast.slice(0, 3).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Crew */}
                                {movieCrew.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Award className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground block">Crew</span>
                                            <span className="font-medium text-foreground">
                                                {movieCrew.slice(0, 3).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
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

                {/* Shows Loading */}
                {showsLoading && (
                    <div className="py-12">
                        <LoadingSpinner text="Loading showtimes..." />
                    </div>
                )}

                {/* Shows Error */}
                {showsError && (
                    <ErrorMessage
                        title="Failed to load showtimes"
                        message={showsError}
                    />
                )}

                {/* Date Selector */}
                {!showsLoading && !showsError && availableDates.length > 0 && (
                    <>
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
                                            {theater.location && (
                                                <p className="text-sm text-muted-foreground">{theater.location}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {shows.map((show) => (
                                                <ShowCard
                                                    key={show.showId || show.id}
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
                    </>
                )}

                {/* No shows at all */}
                {!showsLoading && !showsError && availableDates.length === 0 && (
                    <div className="text-center py-12 glass-effect rounded-xl">
                        <div className="text-4xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h3>
                        <p className="text-muted-foreground">
                            Showtimes will be available soon. Check back later!
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
