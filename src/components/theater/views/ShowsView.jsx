import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '../shared';
import { formatShowTime } from '../utils/dateHelpers';
import { Calendar, Clock, Film, DollarSign } from 'lucide-react';

/**
 * Shows View - Displays shows grouped by date
 */
export function ShowsView({
    theatre,
    groupedShows,
    movies,
    screens,
    onBack,
    onManageScreens
}) {
    const getMovieName = (movieId) => {
        const movie = movies.find(m => m.id === movieId || m.id === parseInt(movieId));
        return movie?.title || `Movie ${movieId}`;
    };

    const getScreenName = (screenId) => {
        const screen = screens.find(s => s.screenId === screenId);
        return screen?.name || `Screen ${screenId}`;
    };

    const showDates = Object.keys(groupedShows);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={onBack} className="gap-1">
                        ← Back
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold text-white">{theatre.name}</h2>
                        <p className="text-sm text-muted-foreground">Scheduled Shows</p>
                    </div>
                </div>
                <Button variant="outline" onClick={onManageScreens} className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Manage Screens
                </Button>
            </div>

            {showDates.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="No Shows Scheduled"
                    description="Add shows from the screen management view."
                    action={onManageScreens}
                    actionLabel="Manage Screens"
                />
            ) : (
                <div className="space-y-8">
                    {showDates.map((dateKey) => {
                        const dayGroup = groupedShows[dateKey];
                        return (
                            <div key={dateKey}>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    {dayGroup.dateLabel}
                                    <Badge variant="outline" className="ml-2">
                                        {dayGroup.shows.length} shows
                                    </Badge>
                                </h3>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {dayGroup.shows.map((show) => (
                                        <div
                                            key={show.showId}
                                            className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-4 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-primary/20 rounded-lg">
                                                    <Film className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-foreground truncate">
                                                        {getMovieName(show.movieId)}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {getScreenName(show.screenId)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatShowTime(show.startTime)}
                                                </div>
                                                {show.language && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {show.language}
                                                    </Badge>
                                                )}
                                                {show.format && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {show.format}
                                                    </Badge>
                                                )}
                                            </div>

                                            {show.pricing && (
                                                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span>₹{show.pricing.silver || show.pricing.Silver} - ₹{show.pricing.diamond || show.pricing.Diamond}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
