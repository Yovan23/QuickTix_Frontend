import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

/**
 * Protected Route component that guards routes based on authentication and roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of allowed roles (e.g., ['ADMIN', 'THEATRE_OWNER'])
 */
export function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading, isAuthenticated } = useAuth()
    const location = useLocation()

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Checking authorization...</p>
                </div>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Check role authorization if roles are specified
    if (allowedRoles && allowedRoles.length > 0) {
        // Get user roles - handle both array and single role formats
        let userRoles = user?.roles || []

        // If roles is a string (single role), convert to array
        if (typeof userRoles === 'string') {
            userRoles = [userRoles]
        }

        // Also check for role property (singular) as fallback
        if (userRoles.length === 0 && user?.role) {
            userRoles = Array.isArray(user.role) ? user.role : [user.role]
        }

        // Normalize roles for comparison (API returns ADMIN, THEATRE_OWNER, USER)
        const normalizedUserRoles = userRoles.map(r => String(r).toUpperCase())
        const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase())

        // Debug logging for troubleshooting
        console.log('[ProtectedRoute] User roles:', normalizedUserRoles)
        console.log('[ProtectedRoute] Allowed roles:', normalizedAllowedRoles)

        // Check if user has at least one of the allowed roles
        const hasRequiredRole = normalizedAllowedRoles.some(role =>
            normalizedUserRoles.includes(role)
        )

        if (!hasRequiredRole) {
            console.warn('[ProtectedRoute] Access denied. User does not have required role.')
            // User doesn't have required role, redirect to unauthorized page
            return <Navigate to="/unauthorized" replace />
        }
    }

    return children
}
