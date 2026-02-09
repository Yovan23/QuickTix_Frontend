import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '../shared';
import {
    Building,
    Plus,
    MapPin,
    Monitor,
    Power,
    Calendar,
    AlertCircle,
    Trash2
} from 'lucide-react';

/**
 * Theatres View - Displays theatre cards with actions
 */
export function TheatresView({
    theatres,
    cities,
    onAddTheatre,
    onManageScreens,
    onViewShows,
    onToggleStatus,
    onDeleteTheatre,
    actionLoading
}) {
    const getCityName = (cityId) => {
        const city = cities.find(c => c.id === cityId || c.id === parseInt(cityId));
        return city?.name || `City ${cityId}`;
    };

    if (theatres.length === 0) {
        return (
            <EmptyState
                icon={Building}
                title="No Theatres Yet"
                description="Create your first theatre to get started with screen and show management."
                action={onAddTheatre}
                actionLabel="Add Theatre"
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Your Theatres ({theatres.length})</h2>
                <Button onClick={onAddTheatre} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Theatre
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {theatres.map((theatre) => (
                    <div
                        key={theatre.theatreId}
                        className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <Building className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{theatre.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            {getCityName(theatre.cityId)}
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={theatre.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                    {theatre.status}
                                </Badge>
                            </div>

                            {theatre.address && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {theatre.address}
                                </p>
                            )}

                            {/* Inactive Theatre Warning */}
                            {theatre.status !== 'ACTIVE' && (
                                <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                    <span className="text-xs text-yellow-500">
                                        Theatre is inactive. Activate to manage screens and shows.
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onManageScreens(theatre)}
                                    className="gap-1"
                                    disabled={theatre.status !== 'ACTIVE'}
                                    title={theatre.status !== 'ACTIVE' ? 'Activate theatre to manage screens' : ''}
                                >
                                    <Monitor className="h-4 w-4" />
                                    Manage Screens
                                </Button>
                                <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => onViewShows(theatre)}
                                    className="gap-1"
                                    disabled={theatre.status !== 'ACTIVE'}
                                    title={theatre.status !== 'ACTIVE' ? 'Activate theatre to view shows' : ''}
                                >
                                    <Calendar className="h-4 w-4" />
                                    View Shows
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onToggleStatus(theatre)}
                                    disabled={actionLoading}
                                    title={theatre.status === 'ACTIVE' ? 'Deactivate theatre' : 'Activate theatre'}
                                >
                                    <Power className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onDeleteTheatre(theatre)}
                                    disabled={actionLoading}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                    title="Delete theatre"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
