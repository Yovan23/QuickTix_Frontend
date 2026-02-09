import { Button } from '@/components/ui/button';
import { StatCard } from '../shared/StatCard';
import {
    Film,
    Building,
    Clock,
    TrendingUp,
    Settings,
    Users
} from 'lucide-react';

/**
 * Overview Tab - Shows stats grid and quick actions
 */
export function OverviewTab({ stats, genres, onTabChange }) {
    return (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={Film} label="Total Movies" value={stats.movies} />
                <StatCard icon={Building} label="Total Theatres" value={stats.theatres} />
                <StatCard
                    icon={Clock}
                    label="Pending Approvals"
                    value={stats.pendingOwners}
                    trend={stats.pendingOwners > 0 ? 'Action Required' : null}
                />
                <StatCard icon={TrendingUp} label="Genres" value={genres.length} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        Quick Actions
                    </h2>
                    <div className="space-y-4">
                        <Button
                            className="w-full justify-start text-left"
                            variant="outline"
                            onClick={() => onTabChange('movies')}
                        >
                            <Film className="mr-2 h-4 w-4" /> Manage Movies
                        </Button>
                        <Button
                            className="w-full justify-start text-left"
                            variant="outline"
                            onClick={() => onTabChange('pending')}
                        >
                            <Building className="mr-2 h-4 w-4" /> Review Pending Owners
                        </Button>
                        <Button
                            className="w-full justify-start text-left"
                            variant="outline"
                            onClick={() => onTabChange('theatres')}
                        >
                            <Users className="mr-2 h-4 w-4" /> View Theatres
                        </Button>
                    </div>
                </div>

                <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Catalogue Stats</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                            <span className="text-sm font-medium">Genres</span>
                            <span className="text-xs text-muted-foreground">{genres.length} available</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
