import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Ticket } from 'lucide-react'

export function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Redirect to where the user came from, or to their dashboard
    const from = location.state?.from?.pathname

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        const result = login(username, password)

        if (result.success) {
            // Check auth context to see user role, but for now we can infer from mock data logic
            // Ideally we would get the user object back from login, but login sets state async or returns user
            // In our simple context sync implementation, we can re-read or just assume logic here.

            // Let's actually look at the MOCK_USERS logic in context. 
            // The context sets the user state.
            // We can determine redirection based on the input for this simple mock.

            let targetPath = '/'
            if (username === 'admin') targetPath = '/admin/dashboard'
            else if (username === 'owner') targetPath = '/theater/dashboard'

            navigate(from || targetPath, { replace: true })
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
            <div className="w-full max-w-md space-y-8 glass-effect p-8 rounded-2xl border border-white/10">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-3 rounded-xl bg-primary/20">
                        <Ticket className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Welcome back
                    </h2>
                    <p className="text-muted-foreground">
                        Enter your credentials to access your account
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">
                                Username
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-secondary/50 border-white/10 focus:border-primary text-white"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">
                                Password
                            </label>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-secondary/50 border-white/10 focus:border-primary text-white"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" size="lg">
                        Sign in
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        <p>Demo Credentials:</p>
                        <div className="mt-2 space-x-4">
                            <span className="text-xs bg-secondary/50 px-2 py-1 rounded">User: user/user123</span>
                            <span className="text-xs bg-secondary/50 px-2 py-1 rounded">Owner: owner/owner123</span>
                            <span className="text-xs bg-secondary/50 px-2 py-1 rounded">Admin: admin/admin123</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
