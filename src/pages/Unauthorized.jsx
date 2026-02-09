import { Link } from 'react-router-dom'
import { ShieldX, Home, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export function Unauthorized() {
    const { user, isAuthenticated } = useAuth()

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="p-6 rounded-full bg-red-500/10 border border-red-500/20">
                        <ShieldX className="h-16 w-16 text-red-500" />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">
                        Access Denied
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        You don't have permission to access this page.
                    </p>
                </div>

                {/* Details */}
                <div className="glass-effect rounded-xl p-6 border border-white/10 text-left space-y-3">
                    <h3 className="font-semibold text-foreground">Why am I seeing this?</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            You may not have the required role to access this resource
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            Your session may have expired
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            The page might be restricted to admins or theatre owners
                        </li>
                    </ul>

                    {isAuthenticated && user && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-sm text-muted-foreground">
                                Logged in as: <span className="text-foreground font-medium">{user.email}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Your roles: <span className="text-foreground font-medium">{user.roles?.join(', ') || 'USER'}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2">
                        <Link to="/">
                            <Home className="h-4 w-4" />
                            Go to Home
                        </Link>
                    </Button>

                    {!isAuthenticated && (
                        <Button asChild size="lg" variant="outline" className="gap-2">
                            <Link to="/login">
                                <LogIn className="h-4 w-4" />
                                Sign In
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Help text */}
                <p className="text-xs text-muted-foreground">
                    If you believe this is an error, please contact support.
                </p>
            </div>
        </div>
    )
}
