import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

/**
 * Movies Tab - Movie listing with CRUD operations
 */
export function MoviesTab({
    movies,
    searchQuery,
    onSearchChange,
    onAddMovie,
    onEditMovie,
    onDeleteMovie,
    actionLoading
}) {
    const filteredMovies = movies.filter((m) =>
        m.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button className="gap-2" onClick={onAddMovie}>
                    <Plus className="h-4 w-4" />
                    Add Movie
                </Button>
            </div>

            <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Movie</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rating</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMovies.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No movies found
                                </td>
                            </tr>
                        ) : (
                            filteredMovies.map((movie) => (
                                <tr key={movie.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={movie.posterUrl || '/placeholder-movie.jpg'}
                                                alt={movie.title}
                                                className="w-10 h-14 object-cover rounded"
                                                onError={(e) => { e.target.src = '/placeholder-movie.jpg'; }}
                                            />
                                            <div>
                                                <span className="font-medium text-foreground">{movie.title}</span>
                                                <p className="text-xs text-muted-foreground">
                                                    {Array.isArray(movie.genres)
                                                        ? movie.genres.map(g => typeof g === 'string' ? g : g.name).join(', ')
                                                        : 'No genres'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-yellow-400">{movie.rating || 'N/A'}/5</span>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {movie.durationMinutes || movie.duration || 'N/A'} min
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={
                                            movie.status?.toUpperCase() === 'RUNNING' ? 'success' :
                                                movie.status?.toUpperCase() === 'UPCOMING' ? 'warning' :
                                                    movie.status?.toUpperCase() === 'ENDED' ? 'secondary' :
                                                        'outline'
                                        }>
                                            {movie.status ? movie.status.charAt(0).toUpperCase() + movie.status.slice(1).toLowerCase() : 'Unknown'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEditMovie(movie)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-400 hover:text-red-300"
                                                onClick={() => onDeleteMovie(movie.id)}
                                                disabled={actionLoading === `delete-${movie.id}`}
                                            >
                                                {actionLoading === `delete-${movie.id}` ? (
                                                    <LoadingSpinner size="sm" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
