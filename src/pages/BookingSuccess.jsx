import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Download, Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

export function BookingSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking } = location.state || {};

    useEffect(() => {
        if (!booking) {
            navigate('/');
            return;
        }

        // Trigger confetti celebration
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, [booking, navigate]);

    if (!booking) return null;

    const { movie, show, seats, totalAmount, bookingId } = booking;

    // Helper functions for flexible field access
    const getMoviePoster = () => movie?.posterUrl || movie?.poster || '/placeholder-movie.jpg';
    const getMovieTitle = () => movie?.title || movie?.name || 'Movie';
    const getMovieLanguage = () => {
        const langs = movie?.languages || [];
        if (Array.isArray(langs) && langs.length > 0) {
            return typeof langs[0] === 'object' ? langs[0].name : langs[0];
        }
        return movie?.language || 'N/A';
    };
    const getMovieCertificate = () => movie?.certificate || movie?.certification || 'UA';
    const getMovieDuration = () => movie?.durationMinutes || movie?.duration || 'N/A';

    const getShowDate = () => {
        const dateStr = show?.startTime || show?.showTime || show?.date;
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const getShowTime = () => {
        const timeStr = show?.startTime || show?.showTime || show?.time;
        if (!timeStr) return 'N/A';
        return new Date(timeStr).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getTheaterName = () => show?.theatreName || show?.theaterName || 'Theater';
    const getTheaterLocation = () => show?.theatreLocation || show?.theaterLocation || '';

    const getSeatLabel = (seat) => seat?.seatNumber || seat?.id || 'N/A';

    return (
        <div className="min-h-screen py-20 px-4 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8">
                {/* Success Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex rounded-full bg-green-500/10 p-4 ring-1 ring-green-500/20">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
                    <p className="text-muted-foreground">
                        Your tickets have been successfully booked.
                    </p>
                </div>

                {/* Ticket Card */}
                <div className="relative bg-card rounded-2xl border border-border overflow-hidden shadow-2xl">
                    {/* Movie Poster Background Blur */}
                    <div className="absolute inset-0 opacity-10">
                        <img
                            src={getMoviePoster()}
                            alt=""
                            className="w-full h-full object-cover blur-xl"
                            onError={(e) => {
                                e.target.src = '/placeholder-movie.jpg';
                            }}
                        />
                    </div>

                    <div className="relative p-6 space-y-6">
                        {/* Movie Info */}
                        <div className="flex gap-4">
                            <img
                                src={getMoviePoster()}
                                alt={getMovieTitle()}
                                className="w-20 h-28 object-cover rounded-lg shadow-md"
                                onError={(e) => {
                                    e.target.src = '/placeholder-movie.jpg';
                                }}
                            />
                            <div className="overflow-hidden">
                                <h2 className="font-bold text-lg truncate">{getMovieTitle()}</h2>
                                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                    <span className="block">{getMovieLanguage()} • {getMovieCertificate()}</span>
                                    <span className="block">{getMovieDuration()} min</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border my-4 border-dashed" />

                        {/* Show Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Date</span>
                                </div>
                                <p className="font-medium">{getShowDate()}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Time</span>
                                </div>
                                <p className="font-medium text-primary">{getShowTime()}</p>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>Theater</span>
                                </div>
                                <p className="font-medium">
                                    {getTheaterName()}
                                    {getTheaterLocation() && `, ${getTheaterLocation()}`}
                                </p>
                            </div>
                        </div>

                        <div className="h-px bg-border my-4 border-dashed" />

                        {/* Seats & Amount */}
                        <div className="flex justify-between items-end">
                            <div className="space-y-2">
                                <span className="text-sm text-muted-foreground">
                                    Seats ({seats?.length || 0})
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {seats?.map((seat, idx) => (
                                        <Badge key={getSeatLabel(seat) || idx} variant="secondary">
                                            {getSeatLabel(seat)}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-muted-foreground">Amount</span>
                                <p className="text-2xl font-bold text-primary">₹{totalAmount}</p>
                            </div>
                        </div>

                        {/* Booking ID */}
                        <div className="pt-4 mt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                            <span>Booking ID</span>
                            <span className="font-mono">{bookingId}</span>
                        </div>
                    </div>

                    {/* Ticket Cutout Effect */}
                    <div className="absolute top-[45%] left-0 w-4 h-8 bg-background rounded-r-full -ml-2" />
                    <div className="absolute top-[45%] right-0 w-4 h-8 bg-background rounded-l-full -mr-2" />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button size="lg" className="w-full gap-2" variant="outline">
                        <Download className="h-4 w-4" />
                        Download Ticket
                    </Button>
                    <Button size="lg" className="w-full gap-2" onClick={() => navigate('/')}>
                        <Home className="h-4 w-4" />
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
