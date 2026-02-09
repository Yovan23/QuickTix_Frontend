import { Link } from 'react-router-dom'
import { Star, Clock, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function MovieCard({ movie, index = 0 }) {
    // Handle both API format and mock data format
    const id = movie.id
    const title = movie.title
    const poster = movie.posterUrl || movie.poster || '/placeholder-movie.jpg'
    const rating = movie.rating || 0
    const duration = movie.durationMinutes || movie.duration || 0

    // Handle genres - API might return array of objects or strings
    const genres = movie.genres || movie.genre || []
    const genreNames = genres.map(g => typeof g === 'object' ? g.name : g)

    // Handle languages - API might return array of objects or single string
    const languages = movie.languages || []
    const languageName = Array.isArray(languages)
        ? (languages[0]?.name || languages[0] || movie.language || 'Unknown')
        : (movie.language || 'Unknown')

    // Format duration to hours and minutes
    const formatDuration = (mins) => {
        if (!mins) return 'N/A'
        const hours = Math.floor(mins / 60)
        const minutes = mins % 60
        if (hours === 0) return `${minutes}m`
        if (minutes === 0) return `${hours}h`
        return `${hours}h ${minutes}m`
    }

    return (
        <Link
            to={`/movie/${id}`}
            className={cn(
                "group relative block overflow-hidden rounded-xl bg-card border border-border card-hover animate-fade-in",
                `animation-delay-${(index % 5) * 100}`
            )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Poster Container */}
            <div className="relative aspect-[2/3] overflow-hidden">
                {/* Poster Image */}
                <img
                    src={poster}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = '/placeholder-movie.jpg'
                        e.target.onerror = null
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Rating Badge - out of 5 */}
                {rating > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
                        <span className="text-xs text-white/60">/5</span>
                    </div>
                )}

                {/* Language Badge */}
                <Badge
                    variant="secondary"
                    className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border-none"
                >
                    {languageName}
                </Badge>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-4 rounded-full bg-primary/90 shadow-lg shadow-primary/50 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    {/* Genre Tags */}
                    {genreNames.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {genreNames.slice(0, 2).map((g, idx) => (
                                <span
                                    key={`${g}-${idx}`}
                                    className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Duration */}
                    <div className="flex items-center gap-1 text-xs text-white/70">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDuration(duration)}</span>
                    </div>
                </div>
            </div>

            {/* Card Footer - Book Button */}
            <div className="p-4 pt-3">
                <Button
                    className="w-full gap-2 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    size="sm"
                >
                    Book Tickets
                </Button>
            </div>
        </Link>
    )
}
