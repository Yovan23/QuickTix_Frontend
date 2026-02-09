import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '../shared';
import { Monitor, Plus, Power, Calendar } from 'lucide-react';

/**
 * Screens View - Displays screens for a selected theatre
 */
export function ScreensView({
    theatre,
    screens,
    onBack,
    onAddScreen,
    onToggleStatus,
    onAddShow,
    actionLoading
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={onBack} className="gap-1">
                        ← Back
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold text-white">{theatre.name}</h2>
                        <p className="text-sm text-muted-foreground">Manage Screens</p>
                    </div>
                </div>
                <Button onClick={onAddScreen} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Screen
                </Button>
            </div>

            {screens.length === 0 ? (
                <EmptyState
                    icon={Monitor}
                    title="No Screens Yet"
                    description="Add screens to this theatre to start scheduling shows."
                    action={onAddScreen}
                    actionLabel="Add First Screen"
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {screens.map((screen) => (
                        <div
                            key={screen.screenId}
                            className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <Monitor className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{screen.name}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Capacity: {screen.capacity || 'N/A'} seats
                                        </p>
                                    </div>
                                </div>
                                <Badge variant={screen.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                    {screen.status}
                                </Badge>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onAddShow(screen)}
                                    className="gap-1 flex-1"
                                    disabled={screen.status !== 'ACTIVE'}
                                >
                                    <Calendar className="h-4 w-4" />
                                    Add Show
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onToggleStatus(screen)}
                                    disabled={actionLoading}
                                    title={screen.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                >
                                    <Power className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
