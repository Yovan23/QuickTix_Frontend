
import { useState, useMemo, useEffect } from 'react';
import { createBooking } from '@/api/services/bookingService';
import { toast } from 'react-hot-toast';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Tv,
    CreditCard,
    CheckCircle,
    Info,
    Timer,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { useSeatSelection } from '@/hooks/useSeatSelection';
import { useSeatSocket } from '@/hooks/useSeatSocket';
import { useAuth } from '@/contexts/AuthContext';

// Seat price categories (matched with backend enums)
const SEAT_CATEGORIES = {
    DIAMOND: { name: 'Diamond', price: 0, color: 'bg-cyan-500' },
    PLATINUM: { name: 'Platinum', price: 0, color: 'bg-violet-600' },
    GOLD: { name: 'Gold', price: 0, color: 'bg-amber-500' },
    SILVER: { name: 'Silver', price: 0, color: 'bg-slate-400' },
};

export function SeatSelection() {
    const { movieId, showId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const {
        movie,
        show,
        layout,
        seatAvailability,
        selectedSeats,
        totalPrice,
        loading,
        error,
        locking,
        lockError,
        lockTimer,
        sessionId,
        toggleSeat,
        clearSelection,
        setSelection,
        lockSelectedSeats,
        refetch,
    } = useSeatSelection(movieId, showId);

    const {
        socketSeats,
        isConnected: socketConnected,
        isDisabled: socketDisabled,
        error: socketError
    } = useSeatSocket(showId, user?.userId || user?.id);

    // Show toast on significant socket errors
    useEffect(() => {
        if (socketError && !socketDisabled) {
            console.warn('[SeatSelection] Socket warning:', socketError);
            // Optional: toast.error('Real-time updates paused', { id: 'socket-warning' });
        }
    }, [socketError, socketDisabled]);

    const [seatsLocked, setSeatsLocked] = useState(false);

    // Restore pending booking state if exists (Deferred Auth)
    useEffect(() => {
        const pending = localStorage.getItem('PENDING_BOOKING');
        if (pending) {
            try {
                const data = JSON.parse(pending);
                // Only restore if it matches current show
                if (data.showId === showId && data.movieId === movieId) {
                    console.log('[SeatSelection] Restoring pending booking state');
                    if (data.selectedSeats && data.selectedSeats.length > 0) {
                        setSelection(data.selectedSeats);
                    }
                }
            } catch (e) {
                console.error('[SeatSelection] Failed to parse pending booking', e);
                localStorage.removeItem('PENDING_BOOKING');
            }
        }
    }, [showId, movieId, setSelection]);

    // Parse seat layout from API response
    const seatLayout = useMemo(() => {
        // If we have a layout from backend (SeatLayout structure)
        if (layout?.rows) {
            console.log('[SeatSelection] Parsing backend layout:', layout);

            return layout.rows.map(row => {
                // Sort cells by column index
                const sortedCells = [...row.cells].sort((a, b) => a.col - b.col);

                // Map cells to our internal seat format
                const seats = sortedCells.map(cell => {
                    // Determine status
                    let status = 'AVAILABLE';
                    if (cell.type === 'SPACE') {
                        return { type: 'SPACE', id: `space-${row.rowIndex}-${cell.col}` };
                    }

                    // Check availability map
                    if (seatAvailability?.seatStatusMap && cell.seatNo) {
                        const backendStatus = seatAvailability.seatStatusMap[cell.seatNo];
                        if (backendStatus) status = backendStatus;
                    }

                    // Check WebSocket updates (overrides backend status)
                    const socketUpdate = socketSeats[cell.seatNo];
                    if (socketUpdate?.status) {
                        // If I locked it myself, I might want to keep it as selected/available visually until confirmed?
                        // But for now, let's treat LOCKED as unavailable to prevent re-selection issues
                        // Unless it's ALREADY in my selectedSeats, then it stays selected?
                        status = socketUpdate.status;
                    }

                    // Determine price based on seat type
                    const seatType = cell.seatType || 'SILVER';
                    let price = 0;
                    if (show?.pricing) {
                        // Convert seatType (SILVER) to pricing key (silver)
                        const priceKey = seatType.toLowerCase();
                        price = show.pricing[priceKey] || 0;
                    }

                    return {
                        seatNumber: cell.seatNo,
                        row: row.rowLabel,
                        col: cell.col,
                        status: status, // AVAILABLE, BOOKED, LOCKED
                        category: seatType, // DIAMOND, GOLD, etc.
                        price: price,
                        type: 'SEAT'
                    };
                });

                return {
                    row: row.rowLabel,
                    seats: seats
                };
            });
        }

        // Fallback or empty
        return [];
    }, [layout, seatAvailability, show, socketSeats]);

    // Generate mock layout if no API data (ONLY if no layout and no loading)
    function generateMockLayout() {
        // ... (keep existing mock logic if needed, but preferably used only when absolutely nothing loaded)
        return [];
    }

    // Handle seat click
    const handleSeatClick = (seat) => {
        if (seat.status === 'BOOKED' || seat.status === 'LOCKED') return;
        if (seatsLocked) return; // Can't change selection after locking
        toggleSeat(seat);
    };

    // Handle proceed to payment
    const handleProceed = async () => {
        if (selectedSeats.length === 0) return;

        // Lock seats first
        if (!seatsLocked) {
            // Check Auth before locking
            if (!user) {
                // Save state and redirect to login
                const bookingState = {
                    movieId,
                    showId,
                    selectedSeats,
                    totalPrice,
                    timestamp: Date.now()
                };
                localStorage.setItem('PENDING_BOOKING', JSON.stringify(bookingState));

                // Navigate to login with return path
                navigate('/login', { state: { from: location } });
                return;
            }

            const result = await lockSelectedSeats(user?.userId || user?.id);
            if (result.success) {
                setSeatsLocked(true);
                // Clear pending state on successful lock
                localStorage.removeItem('PENDING_BOOKING');
            }
            return;
        }

        try {
            toast.loading('Creating booking...', { id: 'create-booking' });

            // Create booking in system
            const bookingData = {
                showId,
                userId: user?.userId || user?.id,
                seatNos: selectedSeats.map(s => s.seatNumber), // Ensure API expects seatNos or seatNumbers
                amount: totalPrice
            };

            const response = await createBooking(bookingData);

            // Handle both wrapped ApiResponse and direct CreateBookingResponse
            const bookingId = response.bookingId || (response.success && response.data?.bookingId);

            if (bookingId) {
                toast.success('Booking initiated!', { id: 'create-booking' });

                // Navigate to payment page with booking details
                navigate(`/payment/${bookingId}`, {
                    state: {
                        booking: {
                            id: bookingId,
                            movieName: movie?.title,
                            showTime: show?.startTime,
                            seatCount: selectedSeats.length,
                            totalAmount: totalPrice,
                            userId: user?.userId || user?.id,
                            // Pass session info for frontend confirmation (Explicit User Request)
                            sessionId: sessionId,
                            seatNumbers: selectedSeats.map(s => s.seatNumber),
                            showId: showId // Ensure showId is passed
                        }
                    }
                });
            } else {
                throw new Error(response.message || 'Failed to create booking - invalid response');
            }
        } catch (error) {
            console.error('Booking creation error:', error);
            toast.error(error.message || 'Failed to initiate booking', { id: 'create-booking' });
        }
    };

    // Reset when timer expires
    useEffect(() => {
        if (lockTimer === 0) {
            setSeatsLocked(false);
        }
    }, [lockTimer]);

    // Helper functions
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return new Date(timeStr).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Loading state
    if (loading) {
        return <LoadingSpinner fullScreen text="Loading seat selection..." size="lg" />;
    }

    // Error state
    if (error) {
        return (
            <ErrorMessage
                fullScreen
                title="Failed to load booking"
                message={error}
                onRetry={refetch}
            />
        );
    }

    // Not found state
    if (!movie || !show) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Show Not Found</h1>
                <p className="text-muted-foreground mb-6">
                    The show you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Button>
            </div>
        );
    }

    // Get movie/show details with fallbacks
    const movieTitle = movie.title || movie.name;
    const theaterName = show.theatreName || show.theaterName || 'Theater';
    const screenName = show.screenName || show.screenType || 'Screen 1';
    const showDate = show.startTime || show.showTime || show.date;

    return (
        <div className="min-h-screen pb-32">
            {/* Header */}
            <div className="bg-card/50 border-b border-border sticky top-0 z-40 backdrop-blur-xl">
                <div className="container py-4">
                    <Link
                        to={`/movie/${movieId}`}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Movie
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-foreground">
                                {movieTitle}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    <span>{theaterName}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(showDate)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatTime(showDate)}</span>
                                </div>
                                <Badge variant="outline" className="gap-1">
                                    <Tv className="h-3 w-3" />
                                    {screenName}
                                </Badge>
                            </div>
                        </div>

                        {/* Lock Timer */}
                        {lockTimer > 0 && (
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg",
                                lockTimer <= 10 ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"
                            )}>
                                <Timer className="h-5 w-5" />
                                <span className="font-mono font-bold text-lg">
                                    {Math.floor(lockTimer / 60)}:{(lockTimer % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Seat Selection Area */}
            <div className="container py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Screen
                    <div className="mb-12 text-center">
                        <div className="relative mx-auto w-3/4 h-3 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full mb-2">
                            <div className="absolute inset-0 blur-lg bg-primary/50" />
                        </div>
                        <span className="text-sm text-muted-foreground">SCREEN</span>
                    </div> */}

                    {/* Seat Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-muted border border-border" />
                            <span className="text-sm text-muted-foreground">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-primary border border-primary" />
                            <span className="text-sm text-muted-foreground">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-muted/30 border border-border/50" />
                            <span className="text-sm text-muted-foreground">Booked</span>
                        </div>
                    </div>

                    {/* Seat Categories */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                        {Object.entries(SEAT_CATEGORIES).map(([key, category]) => {
                            // Get dynamic price from show data
                            // pricing keys are typically lowercase: silver, gold, platinum
                            const priceKey = key.toLowerCase();
                            const price = show?.pricing?.[priceKey] || category.price;

                            // Optional: Only show categories that are available/priced
                            if (price <= 0) return null;

                            return (
                                <div key={key} className="flex items-center gap-2">
                                    <div className={cn("w-3 h-3 rounded-full", category.color)} />
                                    <span className="text-sm font-medium text-foreground">
                                        {category.name} - ₹{price}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Seat Grid */}
                    <div className="overflow-x-auto pb-4">
                        <div className="flex flex-col gap-2 min-w-[600px]">
                            {seatLayout.map(({ row, seats }) => (
                                <div key={row} className="flex items-center gap-2">
                                    {/* Row Label */}
                                    <span className="w-8 text-center font-medium text-muted-foreground">
                                        {row}
                                    </span>

                                    {/* Seats */}
                                    <div className="flex gap-1 flex-1 justify-center">
                                        {seats.map((seat, index) => {
                                            if (seat.type === 'SPACE') {
                                                return <div key={seat.id} className="w-8 h-8" />;
                                            }

                                            const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
                                            const isBooked = seat.status === 'BOOKED' || seat.status === 'LOCKED' || seat.status === 'BLOCKED';

                                            // Determine category color
                                            const categoryKey = seat.category || 'SILVER';
                                            const categoryInfo = SEAT_CATEGORIES[categoryKey] || SEAT_CATEGORIES.SILVER;
                                            const categoryColor = categoryInfo.color;

                                            return (
                                                <div key={seat.seatNumber} className="flex">
                                                    <button
                                                        onClick={() => handleSeatClick(seat)}
                                                        disabled={isBooked || seatsLocked}
                                                        className={cn(
                                                            "w-8 h-8 rounded-md text-xs font-medium transition-all duration-200 relative flex items-center justify-center",
                                                            isBooked
                                                                ? "bg-muted/30 border border-border/50 cursor-not-allowed text-muted-foreground/50"
                                                                : isSelected
                                                                    ? "bg-primary border border-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                                                    : seatsLocked
                                                                        ? "bg-muted border border-border cursor-not-allowed text-foreground"
                                                                        : "bg-muted border border-border hover:border-primary/50 hover:bg-muted/80 text-foreground cursor-pointer"
                                                        )}
                                                        title={`${seat.seatNumber} - ${categoryInfo.name} - ₹${seat.price}`}
                                                    >
                                                        {/* Show seat number (col index usually?) or just part of seatNumber? usually numeric part of A1 -> 1 */}
                                                        {seat.seatNumber.replace(seat.row, '')}

                                                        {/* Category indicator (only if available) */}
                                                        {!isBooked && !isSelected && (
                                                            <div className={cn(
                                                                "absolute -top-1 -right-1 w-2 h-2 rounded-full",
                                                                categoryColor
                                                            )} />
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Row Label */}
                                    <span className="w-8 text-center font-medium text-muted-foreground">
                                        {row}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Screen */}
                    <div className="mb-12 text-center">
                        <div className="relative mx-auto w-3/4 h-3 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full mb-2">
                            <div className="absolute inset-0 blur-lg bg-primary/50" />
                        </div>
                        <span className="text-sm text-muted-foreground">SCREEN</span>
                    </div>

                    {/* Lock Error / Conflict Message */}
                    {lockError && (
                        <div className={cn(
                            "mt-6 flex items-center gap-3 p-4 rounded-xl border",
                            lockError.includes('Refreshing')
                                ? "bg-amber-500/10 border-amber-500/20"
                                : "bg-red-500/10 border-red-500/20"
                        )}>
                            <AlertCircle className={cn(
                                "h-5 w-5 flex-shrink-0",
                                lockError.includes('Refreshing') ? "text-amber-500" : "text-red-500"
                            )} />
                            <div className={cn(
                                "text-sm",
                                lockError.includes('Refreshing') ? "text-amber-400" : "text-red-400"
                            )}>
                                <p className="font-medium">
                                    {lockError.includes('Refreshing') ? 'Seats unavailable' : 'Failed to lock seats'}
                                </p>
                                <p>{lockError}</p>
                            </div>
                        </div>
                    )}

                    {/* Info Note */}
                    <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                            <p>You can select up to 10 seats at a time. Seats will be locked for 5 minutes once you proceed.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Summary - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50">
                <div className="container py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Selected Seats */}
                        <div className="flex-1">
                            {selectedSeats.length > 0 ? (
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-foreground">
                                            {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
                                        </span>
                                        {seatsLocked && (
                                            <Badge variant="secondary" className="text-xs">
                                                Locked
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedSeats
                                            .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
                                            .map((seat) => (
                                                <Badge key={seat.seatNumber} variant="secondary" className="text-xs">
                                                    {seat.seatNumber}
                                                </Badge>
                                            ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">
                                    Please select your seats to continue
                                </p>
                            )}
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center gap-6">
                            {selectedSeats.length > 0 && (
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground block">Total Amount</span>
                                    <span className="text-2xl font-bold text-foreground">₹{totalPrice}</span>
                                </div>
                            )}

                            <Button
                                size="lg"
                                className="gap-2 glow-effect"
                                disabled={selectedSeats.length === 0 || locking}
                                onClick={handleProceed}
                            >
                                {locking ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Locking Seats...
                                    </>
                                ) : seatsLocked ? (
                                    <>
                                        <CreditCard className="h-4 w-4" />
                                        Proceed to Pay
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-4 w-4" />
                                        Lock & Proceed
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}