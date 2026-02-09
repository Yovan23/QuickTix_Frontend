import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Building, Trash2 } from 'lucide-react';

/**
 * Theatres Tab - Display all theatres with delete option for admin
 */
export function TheatresTab({ theatres, onDelete, actionLoading }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">All Theatres ({theatres.length})</h2>

            {theatres.length === 0 ? (
                <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-12 rounded-xl text-center">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">No theatres yet</p>
                    <p className="text-muted-foreground">Theatres will appear here once owners register them.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {theatres.map((theatre) => (
                        <div key={theatre.theatreId || theatre.id} className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                            <h3 className="font-semibold text-foreground">{theatre.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{theatre.address || 'No address'}</p>
                            <div className="flex items-center justify-between">
                                <Badge variant={theatre.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                    {theatre.status || 'Unknown'}
                                </Badge>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    onClick={() => onDelete(theatre.theatreId || theatre.id)}
                                    disabled={actionLoading === `delete-theatre-${theatre.theatreId || theatre.id}`}
                                    title="Delete theatre"
                                >
                                    {actionLoading === `delete-theatre-${theatre.theatreId || theatre.id}` ? (
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
