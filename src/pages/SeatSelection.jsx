import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Tv,
    CreditCard,
    CheckCircle,
    Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getMovieById } from '@/data/movies'
import { getShowById } from '@/data/shows'

// Seat price categories
const SEAT_CATEGORIES = {
    platinum: { name: 'Platinum', price: 450, color: 'bg-violet-600' },
    gold: { name: 'Gold', price: 350, color: 'bg-amber-500' },
    silver: { name: 'Silver', price: 250, color: 'bg-slate-400' },
}

// Generate seat layout for a theater
const generateSeatLayout = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const seatsPerRow = 16
    const layout = []

    rows.forEach((row, rowIndex) => {
        const rowSeats = []
        const category = rowIndex < 3 ? 'platinum' : rowIndex < 6 ? 'gold' : 'silver'

        for (let i = 1; i <= seatsPerRow; i++) {
            // Add aisle gap in the middle
            if (i === 5 || i === 13) {
                rowSeats.push({ type: 'aisle' })
            }

            // Randomly mark some seats as booked (for demo)
            const isBooked = Math.random() < 0.25

            rowSeats.push({
                type: 'seat',
                id: `${row}${i}`,
                row,
                number: i,
                category,
                isBooked,
            })
        }
        layout.push({ row, seats: rowSeats })
    })

    return layout
}

export function SeatSelection() {
    const { movieId, showId } = useParams()
    const navigate = useNavigate()

    const movie = getMovieById(movieId)
    const show = useMemo(() => getShowById(movieId, showId), [movieId, showId])

    const [selectedSeats, setSelectedSeats] = useState([])
    const seatLayout = useMemo(() => generateSeatLayout(), [])

    const handleSeatClick = (seat) => {
        if (seat.isBooked) return

        setSelectedSeats((prev) => {
            const isSelected = prev.some((s) => s.id === seat.id)
            if (isSelected) {
                return prev.filter((s) => s.id !== seat.id)
            }
            if (prev.length >= 10) {
                return prev // Max 10 seats
            }
            return [...prev, seat]
        })
    }

    const getSeatPrice = (seat) => {
        return SEAT_CATEGORIES[seat.category].price
    }

    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0)
    }, [selectedSeats])

    const handleProceed = () => {
        const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase()
        navigate('/booking-success', {
            state: {
                booking: {
                    movie,
                    show,
                    seats: selectedSeats,
                    totalAmount: totalPrice,
                    bookingId
                }
            }
        })
    }

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
        )
    }

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
                                {movie.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    <span>{show.theaterName}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(show.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{show.time}</span>
                                </div>
                                <Badge variant="outline" className="gap-1">
                                    <Tv className="h-3 w-3" />
                                    {show.screenType}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seat Selection Area */}
            <div className="container py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Screen */}
                    <div className="mb-12 text-center">
                        <div className="relative mx-auto w-3/4 h-3 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full mb-2">
                            <div className="absolute inset-0 blur-lg bg-primary/50" />
                        </div>
                        <span className="text-sm text-muted-foreground">SCREEN</span>
                    </div>

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
                        {Object.entries(SEAT_CATEGORIES).map(([key, category]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded-full", category.color)} />
                                <span className="text-sm font-medium text-foreground">
                                    {category.name} - ₹{category.price}
                                </span>
                            </div>
                        ))}
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
                                            if (seat.type === 'aisle') {
                                                return <div key={`aisle-${index}`} className="w-6" />
                                            }

                                            const isSelected = selectedSeats.some((s) => s.id === seat.id)
                                            const category = SEAT_CATEGORIES[seat.category]

                                            return (
                                                <button
                                                    key={seat.id}
                                                    onClick={() => handleSeatClick(seat)}
                                                    disabled={seat.isBooked}
                                                    className={cn(
                                                        "w-8 h-8 rounded-md text-xs font-medium transition-all duration-200 relative group",
                                                        seat.isBooked
                                                            ? "bg-muted/30 border border-border/50 cursor-not-allowed text-muted-foreground/50"
                                                            : isSelected
                                                                ? "bg-primary border border-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                                                : "bg-muted border border-border hover:border-primary/50 hover:bg-muted/80 text-foreground cursor-pointer"
                                                    )}
                                                    title={`${seat.id} - ${category.name} - ₹${category.price}`}
                                                >
                                                    {seat.number}
                                                    {/* Category indicator */}
                                                    {!seat.isBooked && !isSelected && (
                                                        <div className={cn(
                                                            "absolute -top-1 -right-1 w-2 h-2 rounded-full",
                                                            category.color
                                                        )} />
                                                    )}
                                                </button>
                                            )
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

                    {/* Info Note */}
                    <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                            <p>You can select up to 10 seats at a time. Click on a seat to select or deselect it.</p>
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
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedSeats.sort((a, b) => a.id.localeCompare(b.id)).map((seat) => (
                                            <Badge key={seat.id} variant="secondary" className="text-xs">
                                                {seat.id}
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
                                disabled={selectedSeats.length === 0}
                                onClick={handleProceed}
                            >
                                <CreditCard className="h-4 w-4" />
                                Proceed to Pay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
