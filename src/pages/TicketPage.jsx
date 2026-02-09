import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Ticket, Calendar, MapPin, Clock, Home, Download } from 'lucide-react';
import api from '../api';

export default function TicketPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    // Ticket State
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTicket();
    }, [bookingId]);

    const loadTicket = async () => {
    try {
        setLoading(true);

        // 1️⃣ Get Booking
        const bookingRes = await api.get(`/bookings/${bookingId}`);
        const booking = bookingRes.data;

        if (!booking) {
            throw new Error("Booking not found");
        }

        // 2️⃣ Fetch seats + show in parallel
        const [seatsRes, showRes] = await Promise.all([
            api.get(`/bookings/${bookingId}/seats`),   // create this endpoint if missing
            api.get(`/shows/${booking.showId}`)       // show service endpoint
        ]);

        const seats = seatsRes.data || [];
        const show = showRes.data;

        // 3️⃣ Fetch movie details if show only contains movieId
        let movieName = show.movieName;

        if (!movieName && show.movieId) {
            const movieRes = await api.get(`/movies/${show.movieId}`);
            movieName = movieRes.data.title;
        }

        // 4️⃣ Build ticket
        setTicket({
            ticketId: `TKT-${booking.id}`,
            movieName: movieName || "Movie",
            theatreName: show.theatreName || "Theatre",
            screenName: show.screenName || "Screen 1",
            showTime: show.startTime || booking.createdAt,
            seatNumbers: Array.isArray(seats) ? seats.join(", ") : "",
            qrCodeData: `QUICKTIX-${booking.id}-${booking.userId}`,
            totalAmount: booking.totalAmount,
            status: booking.status,
            paymentStatus: booking.paymentStatus
        });

    } catch (error) {
        console.error("Error loading ticket:", error);
        toast.error("Could not fetch booking details");
    } finally {
        setLoading(false);
    }
};


    const handleDownload = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
                loading: 'Generating PDF...',
                success: 'Ticket downloaded!',
                error: 'Download failed',
            }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-neutral-400 mb-4">Ticket not found</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
                >
                    Go Home
                </button>
            </div>
        );
    }

    // QR Code URL (using public API)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticket.qrCodeData)}`;

    return (
        <div className="min-h-screen bg-neutral-900 text-white py-12 px-4 flex flex-col items-center">

            {/* Ticket Card */}
            <div className="max-w-md w-full bg-white text-black rounded-3xl overflow-hidden shadow-2xl relative">

                {/* Header / Movie Poster simulation */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 h-32 p-6 flex items-center justify-center relative">
                    <div className="absolute -bottom-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                        <Ticket className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                <div className="pt-12 pb-8 px-8 text-center">
                    <h1 className="text-2xl font-black mb-1 text-neutral-800 uppercase tracking-wide">{ticket.movieName || 'Movie Title'}</h1>
                    <p className="text-sm text-neutral-500 font-medium">{ticket.theatreName} • {ticket.screenName}</p>

                    {/* QR Code */}
                    <div className="my-6 flex justify-center">
                        <div className="p-2 border-2 border-dashed border-neutral-300 rounded-xl">
                            <img src={qrCodeUrl} alt="Ticket QR" className="w-48 h-48 rounded-lg" />
                        </div>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono mb-6">{ticket.ticketId}</p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-left bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <div>
                            <p className="text-xs text-neutral-400 uppercase font-bold mb-1">Date & Time</p>
                            <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                                <Clock className="w-4 h-4 text-red-500" />
                                {new Date(ticket.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">
                                {new Date(ticket.showTime).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 uppercase font-bold mb-1">Seats</p>
                            <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                                <div className="px-2 py-1 bg-neutral-200 rounded text-sm">
                                    {ticket.seatNumbers}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashed Line */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute left-0 w-6 h-6 bg-neutral-900 rounded-full -translate-x-1/2"></div>
                    <div className="w-full border-t-2 border-dashed border-neutral-300"></div>
                    <div className="absolute right-0 w-6 h-6 bg-neutral-900 rounded-full translate-x-1/2"></div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-neutral-50 flex gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex-1 py-3 border border-neutral-300 rounded-xl font-semibold text-neutral-600 hover:bg-neutral-100 flex items-center justify-center gap-2 transition"
                    >
                        <Download className="w-4 h-4" /> Download
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 flex items-center justify-center gap-2 transition"
                    >
                        <Home className="w-4 h-4" /> Home
                    </button>
                </div>
            </div>

            <p className="mt-8 text-neutral-500 text-sm">Show this QR code at the entrance</p>
        </div>
    );
}