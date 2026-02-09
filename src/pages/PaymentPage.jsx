import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CreditCard, Lock, ShieldCheck, Ticket } from 'lucide-react';
import { initiatePayment, verifyPayment, failPayment, openRazorpayCheckout } from '../api/services/paymentService';
import { getBookingById } from '../api/services/bookingService';
import { confirmSeats, unlockSeats } from '../api/services/showSeatService';

export default function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Booking details from location state or fetched
    const [booking, setBooking] = useState(location.state?.booking || null);
    const [loading, setLoading] = useState(!location.state?.booking);
    const [processing, setProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default

    useEffect(() => {
        if (!booking && bookingId) {
            loadBooking();
        }
    }, [bookingId]);

    const loadBooking = async () => {
        try {
            setLoading(true);
            const response = await getBookingById(bookingId);
            if (response.success) {
                setBooking(response.data);
            } else {
                toast.error('Failed to load booking details');
                navigate('/');
            }
        } catch (error) {
            console.error('Error loading booking:', error);
            toast.error('Error loading booking details');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    toast.error('Session expired. Please try again.');
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePayment = async () => {
        if (!booking) return;

        const currentBookingId = booking.id || booking.bookingId;

        try {
            setProcessing(true);

            // 1. Initiate Payment - creates Razorpay order
            console.log('[PaymentPage] Initiating payment for booking:', currentBookingId);
            const initResponse = await initiatePayment({
                bookingId: currentBookingId,
                amount: booking.totalAmount || booking.amount,
                currency: 'INR',
                userId: booking.userId
            });

            if (!initResponse.success) {
                throw new Error(initResponse.message || 'Payment initiation failed');
            }

            const { razorpayOrderId, amount, currency } = initResponse.data;
            console.log('[PaymentPage] Payment initiated, orderId:', razorpayOrderId);

            // 2. Open Razorpay Checkout Modal
            await openRazorpayCheckout({
                orderId: razorpayOrderId,
                amount: amount * 100, // Convert to paise
                currency: currency,
                name: 'QuickTix',
                description: `Booking #${currentBookingId}`,
                prefill: {
                    email: booking.userEmail || '',
                },
                onSuccess: async (response) => {
                    console.log('[PaymentPage] Razorpay success response:', response);
                    try {
                        toast.loading('Verifying payment...', { id: 'verify-payment' });

                        // 3. Verify Payment with backend
                        const verifyRes = await verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });

                        if (verifyRes.success) {
                            // Explicit Seat Confirmation (User Request)
                            if (booking.sessionId && booking.seatNumbers) {
                                console.log('[PaymentPage] Explicitly confirming seats...');
                                try {
                                    await confirmSeats({
                                        showId: booking.showId,
                                        bookingId: currentBookingId,
                                        userId: booking.userId,
                                        sessionId: booking.sessionId,
                                        seatNumbers: booking.seatNumbers
                                    });
                                    console.log('[PaymentPage] Seats confirmed explicitly');
                                } catch (confirmError) {
                                    console.error('[PaymentPage] Explicit confirmation failed (backend may have already confirmed):', confirmError);
                                }
                            }

                            toast.success('Payment successful! Redirecting to your ticket...', { id: 'verify-payment' });
                            // Reset processing BEFORE navigation
                            setProcessing(false);
                            navigate(`/ticket/${currentBookingId}`, { replace: true });
                        } else {
                            throw new Error(verifyRes.message || 'Payment verification failed');
                        }
                    } catch (verifyError) {
                        console.error('[PaymentPage] Verification error:', verifyError);
                        toast.error('Payment verification failed. Please contact support.', { id: 'verify-payment' });
                        setProcessing(false);
                    }
                },
                onFailure: async (error) => {
                    console.error('[PaymentPage] Payment failed or cancelled:', error);
                    const reason = error?.description || error?.error || 'Payment cancelled by user';

                    // Explicit Seat Unlock (User Request)
                    if (booking.sessionId && booking.seatNumbers) {
                        console.log('[PaymentPage] Explicitly unlocking seats...');
                        try {
                            await unlockSeats({
                                showId: booking.showId,
                                userId: booking.userId,
                                sessionId: booking.sessionId,
                                seatNumbers: booking.seatNumbers
                            });
                        } catch (unlockError) {
                            console.error('[PaymentPage] Explicit unlock failed:', unlockError);
                        }
                    }

                    // Notify backend to cancel booking and release seats
                    try {
                        toast.loading('Cancelling booking...', { id: 'cancel-booking' });
                        await failPayment({
                            bookingId: currentBookingId,
                            failureReason: reason
                        });
                        toast.error('Payment cancelled. Your seats have been released.', { id: 'cancel-booking' });
                    } catch (cancelError) {
                        console.error('[PaymentPage] Failed to notify backend of cancellation:', cancelError);
                        toast.error('Payment cancelled. Please wait for seat lock to expire.', { id: 'cancel-booking' });
                    }

                    setProcessing(false);
                }
            });

        } catch (error) {
            console.error('[PaymentPage] Payment error:', error);
            toast.error(error.message || 'Failed to process payment');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!booking) return null;

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-800 rounded-xl shadow-2xl p-6 border border-neutral-700">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-green-500" />
                        Secure Payment
                    </h2>
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full text-sm font-medium">
                        <Lock className="w-3 h-3" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Booking Summary */}
                <div className="space-y-4 mb-8">
                    <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-700">
                        <p className="text-neutral-400 text-sm">Amount to Pay</p>
                        <p className="text-3xl font-bold text-white">₹{booking.totalAmount || booking.amount}</p>
                    </div>

                    <div className="space-y-2 text-sm text-neutral-300">
                        <div className="flex justify-between">
                            <span>Booking ID</span>
                            <span className="font-mono">{booking.id || bookingId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tickets</span>
                            <span>{booking.seatCount || 1} Seats</span>
                        </div>
                    </div>
                </div>

                {/* Pay Button */}
                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Pay ₹{booking.totalAmount || booking.amount}
                        </>
                    )}
                </button>

                <p className="mt-4 text-center text-xs text-neutral-500 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Payments provided by Razorpay
                </p>
            </div>
        </div>
    );
}
