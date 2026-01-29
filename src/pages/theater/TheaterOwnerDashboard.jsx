import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building, LogOut, Plus, MapPin, Monitor, Calendar } from 'lucide-react'

export function TheaterOwnerDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [theaters, setTheaters] = useState([
        { id: 1, name: 'PVR Cinemas', location: 'Downtown Mall', screens: 4 },
        { id: 2, name: 'INOX', location: 'City Center', screens: 6 }
    ])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 container">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gradient">Theater Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome, {user?.name || 'Partner'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => { }} className="gap-2">
                        <Plus className="h-4 w-4" /> Add Theater
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Theater List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        My Theaters
                    </h2>

                    <div className="grid gap-4">
                        {theaters.map((theater) => (
                            <div key={theater.id} className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-secondary/50 transition-colors group">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                                            {theater.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" /> {theater.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Monitor className="h-4 w-4" /> {theater.screens} Screens
                                            </span>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline">Manage Shows</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar - Quick Stats or Notifications */}
                <div className="space-y-6">
                    <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                        <h2 className="text-lg font-bold text-white mb-4">Today's Overview</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span className="text-sm text-gray-300">Total Bookings</span>
                                <span className="font-bold text-white">1,245</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span className="text-sm text-gray-300">Revenue</span>
                                <span className="font-bold text-green-400">$12,450</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">Occupancy</span>
                                <span className="font-bold text-primary">85%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Upcoming Schedules
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            You have 3 shows pending approval for next week.
                        </p>
                        <Button variant="secondary" className="w-full">View Schedule</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
