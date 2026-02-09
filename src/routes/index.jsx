import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

// Lazy load pages for better performance
// Named exports require .then(module => ({ default: module.ExportName }))
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const MovieDetails = lazy(() => import('@/pages/MovieDetails').then(m => ({ default: m.MovieDetails })))
const SeatSelection = lazy(() => import('@/pages/SeatSelection').then(m => ({ default: m.SeatSelection })))
const PaymentPage = lazy(() => import('@/pages/PaymentPage'))
const TicketPage = lazy(() => import('@/pages/TicketPage'))
const BookingSuccess = lazy(() => import('@/pages/BookingSuccess').then(m => ({ default: m.BookingSuccess })))
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })))
const Register = lazy(() => import('@/pages/Register').then(m => ({ default: m.Register })))
const Unauthorized = lazy(() => import('@/pages/Unauthorized').then(m => ({ default: m.Unauthorized })))
const BecomePartner = lazy(() => import('@/pages/BecomePartner').then(m => ({ default: m.BecomePartner })))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const TheaterOwnerDashboard = lazy(() => import('@/pages/theater/TheaterOwnerDashboard').then(m => ({ default: m.TheaterOwnerDashboard })))

// Loading fallback component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
    </div>
)

export function AppRoutes() {
    return (
        <AuthProvider>
            <Layout>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route path="/movie/:id" element={<MovieDetails />} />
                        <Route path="/become-partner" element={<BecomePartner />} />

                        {/* Seat Selection - Public access */}
                        <Route
                            path="/seat-selection/:movieId/:showId"
                            element={
                                <ErrorBoundary>
                                    <SeatSelection />
                                </ErrorBoundary>
                            }
                        />

                        {/* Payment Route */}
                        <Route
                            path="/payment/:bookingId"
                            element={
                                <ProtectedRoute allowedRoles={['USER', 'THEATRE_OWNER', 'ADMIN']}>
                                    <PaymentPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Ticket Route */}
                        <Route
                            path="/ticket/:bookingId"
                            element={
                                <ProtectedRoute allowedRoles={['USER', 'THEATRE_OWNER', 'ADMIN']}>
                                    <TicketPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected User Routes */}
                        <Route
                            path="/booking-success"
                            element={
                                <ProtectedRoute allowedRoles={['USER', 'THEATRE_OWNER', 'ADMIN']}>
                                    <BookingSuccess />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Theatre Owner Routes */}
                        <Route
                            path="/theater/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['THEATRE_OWNER', 'ADMIN']}>
                                    <TheaterOwnerDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Suspense>
            </Layout>
        </AuthProvider>
    )
}
