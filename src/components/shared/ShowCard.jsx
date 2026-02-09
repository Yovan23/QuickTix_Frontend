import { Clock, MapPin, Users, Tv, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Determine status based on available seats
 */
const getStatus = (availableSeats, totalSeats) => {
    if (availableSeats === 0) return 'sold-out';
    const percentage = totalSeats ? (availableSeats / totalSeats) * 100 : 100;
    if (percentage <= 10) return 'almost-full';
    if (percentage <= 30) return 'fast-filling';
    return 'available';
};

const statusConfig = {
    'available': {
        label: 'Available',
        variant: 'success',
        bgClass: 'bg-emerald-500/10 border-emerald-500/30',
    },
    'fast-filling': {
        label: 'Fast Filling',
        variant: 'warning',
        bgClass: 'bg-amber-500/10 border-amber-500/30',
    },
    'almost-full': {
        label: 'Almost Full',
        variant: 'warning',
        bgClass: 'bg-orange-500/10 border-orange-500/30',
    },
    'sold-out': {
        label: 'Sold Out',
        variant: 'destructive',
        bgClass: 'bg-red-500/10 border-red-500/30',
    },
};

/**
 * ShowCard component - displays a single showtime
 * Handles both mock data and API response formats
 */
export function ShowCard({ show, onSelect }) {
    // Handle different API response field names
    const theaterName = show.theatreName || show.theaterName || 'Unknown Theater';
    const theaterLocation = show.theatreLocation || show.theaterLocation || '';
    const screenName = show.screenName || show.screenType || 'Standard';

    // Handle time - could be startTime (ISO) or time (string)
    const showTime = show.startTime || show.showTime || show.time;
    const displayTime = showTime
        ? new Date(showTime).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        : 'N/A';

    // Handle price and seats
    let price = show.price || show.ticketPrice || 0;
    if (show.pricing) {
        // Find min price > 0 from available categories
        const prices = Object.values(show.pricing).filter(p => p && p > 0);
        if (prices.length > 0) {
            price = Math.min(...prices);
        }
    }

    const availableSeats = show.availableSeats ?? show.seatsAvailable ?? 50;
    const totalSeats = show.totalSeats ?? show.capacity ?? 100;

    // Determine status
    const status = show.status || getStatus(availableSeats, totalSeats);
    const config = statusConfig[status] || statusConfig['available'];
    const isSoldOut = status === 'sold-out';

    return (
        <div
            className={cn(
                "relative rounded-xl border p-4 transition-all duration-300",
                isSoldOut
                    ? "bg-muted/30 border-border opacity-60"
                    : "bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer",
                config.bgClass
            )}
            onClick={() => !isSoldOut && onSelect?.(show)}
        >
            {/* Show Details */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Time */}
                <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground text-lg">{displayTime}</span>
                </div>

                {/* Screen Type */}
                <Badge variant="outline" className="gap-1">
                    <Tv className="h-3 w-3" />
                    {screenName}
                </Badge>
            </div>

            {/* Seats & Location */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
                {/* Seats Available */}
                <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{availableSeats} seats</span>
                </div>

                {/* Location if available */}
                {theaterLocation && (
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[150px]">{theaterLocation}</span>
                    </div>
                )}
            </div>

            {/* Price & Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-baseline">
                    <IndianRupee className="h-4 w-4 text-foreground" />
                    <span className="text-2xl font-bold text-foreground">{price}</span>
                    <span className="text-sm text-muted-foreground ml-1">onwards</span>
                </div>

                <Badge variant={config.variant}>
                    {config.label}
                </Badge>
            </div>

            {/* Book Button */}
            {!isSoldOut && (
                <Button
                    size="sm"
                    className="w-full mt-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(show);
                    }}
                >
                    Select Seats
                </Button>
            )}

            {isSoldOut && (
                <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-4"
                    disabled
                >
                    Sold Out
                </Button>
            )}
        </div>
    );
}
