import { MovieCard } from './MovieCard'
import { Skeleton } from '@/components/ui/skeleton'

export function MovieGrid({ movies, loading = false }) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <MovieCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No movies found</h3>
                <p className="text-muted-foreground max-w-md">
                    Try adjusting your filters or search terms to find what you're looking for.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
        </div>
    )
}

function MovieCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden bg-card border border-border">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    )
}
