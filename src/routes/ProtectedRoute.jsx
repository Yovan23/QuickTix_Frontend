import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return null // Or a loading spinner
    }

    if (!user) {
        // Redirect to login page with the return url
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User role not authorized, redirect to home
        return <Navigate to="/" replace />
    }

    return children
}
