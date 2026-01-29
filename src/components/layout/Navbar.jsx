import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Film, Search, Ticket, User, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/#movies' },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/')
        setIsOpen(false)
    }

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin/dashboard'
        if (user?.role === 'theater_owner') return '/theater/dashboard'
        return null
    }

    const dashboardLink = getDashboardLink()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
            <div className="container">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xl md:text-2xl font-bold"
                    >
                        <div className="p-2 rounded-lg bg-primary/20">
                            <Ticket className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                        </div>
                        <span className="text-gradient">QuickTix</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 pl-10 bg-secondary/50 border-white/10 focus:border-primary"
                            />
                        </div>

                        {/* Nav Links */}
                        <div className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        location.pathname === link.href
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-white">
                                    Hi, {user.name.split(' ')[0]}
                                </span>
                                {dashboardLink && (
                                    <Link to={dashboardLink}>
                                        <Button size="sm" variant="ghost" className="gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                                <Button size="sm" variant="outline" onClick={handleLogout} className="gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button size="sm" className="gap-2">
                                    <User className="h-4 w-4" />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden absolute top-full left-0 right-0 glass-effect border-b border-white/10 transition-all duration-300 overflow-hidden",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="container py-4 space-y-4">
                    {/* Mobile Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 bg-secondary/50 border-white/10"
                        />
                    </div>

                    {/* Mobile Nav Links */}
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    location.pathname === link.href
                                        ? "bg-primary/20 text-primary"
                                        : "text-muted-foreground hover:bg-secondary"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Auth Buttons */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                        {user ? (
                            <>
                                {dashboardLink && (
                                    <Link
                                        to={dashboardLink}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Button variant="ghost" className="w-full justify-start gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                            >
                                <Button className="w-full gap-2">
                                    <User className="h-4 w-4" />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
