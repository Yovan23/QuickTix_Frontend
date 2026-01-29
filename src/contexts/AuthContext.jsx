import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Mock users for demonstration
const MOCK_USERS = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
    { username: 'owner', password: 'owner123', role: 'theater_owner', name: 'Theater Owner' },
    { username: 'user', password: 'user123', role: 'user', name: 'Regular User' },
]

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check local storage for persisted login
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = (username, password) => {
        const foundUser = MOCK_USERS.find(
            (u) => u.username === username && u.password === password
        )

        if (foundUser) {
            // eslint-disable-next-line no-unused-vars
            const { password, ...userWithoutPassword } = foundUser
            setUser(userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            return { success: true }
        }

        return { success: false, error: 'Invalid username or password' }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
