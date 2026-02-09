import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
    login as apiLogin,
    register as apiRegister,
    parseToken,
    isTokenExpired
} from '@/api/services/authService'

const AuthContext = createContext(null)

/**
 * Auth Provider that manages user authentication state
 * Uses JWT tokens for authentication with the Identity Service
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    /**
     * Initialize auth state from stored token
     */
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const token = localStorage.getItem('accessToken')
                const storedUser = localStorage.getItem('user')

                if (token && !isTokenExpired(token)) {
                    const decoded = parseToken(token)

                    // Try to use stored user data first (has complete roles)
                    // Fall back to decoded token if no stored user
                    let userData = null

                    if (storedUser) {
                        try {
                            userData = JSON.parse(storedUser)
                            console.log('[AuthContext] Restored user from localStorage:', userData)
                        } catch (e) {
                            console.error('[AuthContext] Failed to parse stored user:', e)
                        }
                    }

                    if (!userData && decoded) {
                        userData = {
                            userId: decoded.userId,
                            email: decoded.sub,
                            roles: decoded.roles || [],
                            name: decoded.name || decoded.sub?.split('@')[0] || 'User',
                        }
                        console.log('[AuthContext] Created user from token:', userData)
                    }

                    if (userData) {
                        // Ensure roles is an array
                        if (!Array.isArray(userData.roles)) {
                            userData.roles = userData.roles ? [userData.roles] : []
                        }
                        setUser(userData)
                    }
                } else if (token) {
                    // Token expired, clean up
                    console.log('[AuthContext] Token expired, cleaning up')
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('user')
                }
            } catch (err) {
                console.error('Failed to initialize auth:', err)
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()
    }, [])

    /**
     * Login with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Result { success, error? }
     */
    const login = useCallback(async (email, password) => {
        try {
            setError(null)
            setLoading(true)

            const response = await apiLogin({ email, password })

            // Extract token and user info from response
            const token = response.token || response.data?.token
            const userId = response.userId || response.data?.userId
            const roles = response.roles || response.data?.roles || []

            if (!token) {
                throw new Error('No token received from server')
            }

            // Store token
            localStorage.setItem('accessToken', token)

            // Parse token to get user info
            const decoded = parseToken(token)

            const userData = {
                userId: userId || decoded?.userId,
                email: decoded?.sub || email,
                roles: roles,
                name: decoded?.name || email.split('@')[0],
            }

            // Store user info
            localStorage.setItem('user', JSON.stringify(userData))
            setUser(userData)

            return { success: true, user: userData }
        } catch (err) {
            console.error('Login failed:', err)
            const errorMessage = err.response?.data?.message || err.message || 'Login failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }, [])

    /**
     * Register a new user
     * @param {Object} data - Registration data { name, email, password, phone }
     * @returns {Promise<Object>} Result { success, error? }
     */
    const register = useCallback(async (data) => {
        try {
            setError(null)
            setLoading(true)

            await apiRegister(data)

            return { success: true, message: 'Registration successful! Please login.' }
        } catch (err) {
            console.error('Registration failed:', err)
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }, [])

    /**
     * Logout user
     */
    const logout = useCallback(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        setUser(null)
        setError(null)
    }, [])

    /**
     * Check if user has a specific role
     * @param {string|string[]} requiredRoles - Role(s) to check
     * @returns {boolean} True if user has at least one of the required roles
     */
    const hasRole = useCallback((requiredRoles) => {
        if (!user || !user.roles) return false

        const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]

        // Normalize roles for comparison (handle both 'admin' and 'ADMIN')
        const userRolesNormalized = user.roles.map(r => r.toUpperCase())

        return rolesToCheck.some(role =>
            userRolesNormalized.includes(role.toUpperCase())
        )
    }, [user])

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = !!user

    /**
     * Check if user is admin
     */
    const isAdmin = hasRole('ADMIN')

    /**
     * Check if user is theatre owner
     */
    const isTheatreOwner = hasRole('THEATRE_OWNER')

    /**
     * Get access token
     */
    const getToken = useCallback(() => {
        return localStorage.getItem('accessToken')
    }, [])

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        hasRole,
        isAuthenticated,
        isAdmin,
        isTheatreOwner,
        getToken,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
