import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { MovieDetails } from '@/pages/MovieDetails'
import { SeatSelection } from '@/pages/SeatSelection'
import { BookingSuccess } from '@/pages/BookingSuccess'
import { Login } from '@/pages/Login'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { TheaterOwnerDashboard } from '@/pages/theater/TheaterOwnerDashboard'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
    return (
        <AuthProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                    <Route path="/seat-selection/:movieId/:showId" element={<SeatSelection />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />

                    {/* Protected Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/theater/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['theater_owner']}>
                                <TheaterOwnerDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Layout>
        </AuthProvider>
    )
}
