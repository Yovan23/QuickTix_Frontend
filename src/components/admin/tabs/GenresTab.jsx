import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';

/**
 * Genres Tab - Genre CRUD management
 */
export function GenresTab({
    genres,
    onAdd,
    onEdit,
    onDelete,
    actionLoading
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Manage Genres
                </h2>
                <Button onClick={onAdd} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Genre
                </Button>
            </div>

            {genres.length === 0 ? (
                <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-12 rounded-xl text-center">
                    <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">No genres yet</p>
                    <p className="text-muted-foreground mb-4">Add genres for movie categorization.</p>
                    <Button onClick={onAdd}>Add First Genre</Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {genres.map((genre) => (
                        <div key={genre.id} className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Tag className="h-5 w-5 text-primary" />
                                </div>
                                <p className="font-medium text-foreground">{genre.name}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onEdit(genre)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300"
                                    onClick={() => onDelete(genre.id)}
                                    disabled={actionLoading === `delete-genre-${genre.id}`}
                                >
                                    {actionLoading === `delete-genre-${genre.id}` ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
