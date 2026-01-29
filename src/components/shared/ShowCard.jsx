import { Clock, MapPin, Users, Tv } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
}

export function ShowCard({ show, onSelect }) {
    const {
        theaterName,
        theaterLocation,
        time,
        screenType,
        price,
        availableSeats,
        status,
    } = show

    const config = statusConfig[status] || statusConfig['available']
    const isSoldOut = status === 'sold-out'

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
            {/* Theater Info */}
            <div className="mb-3">
                <h4 className="font-semibold text-foreground">{theaterName}</h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{theaterLocation}</span>
                </div>
            </div>

            {/* Show Details */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Time */}
                <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{time}</span>
                </div>

                {/* Screen Type */}
                <Badge variant="outline" className="gap-1">
                    <Tv className="h-3 w-3" />
                    {screenType}
                </Badge>

                {/* Seats Available */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{availableSeats} seats</span>
                </div>
            </div>

            {/* Price & Status */}
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-2xl font-bold text-foreground">₹{price}</span>
                    <span className="text-sm text-muted-foreground ml-1">onwards</span>
                </div>

                <Badge variant={config.variant}>
                    {config.label}
                </Badge>
            </div>

            {/* Book Button - shows on hover/touch */}
            {!isSoldOut && (
                <Button
                    size="sm"
                    className="w-full mt-4"
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelect?.(show)
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
    )
}
