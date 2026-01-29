import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Users, Film, Building, LogOut, TrendingUp, Settings } from 'lucide-react'

// Dashboard Stats Card Component
const StatCard = ({ icon: Icon, label, value, trend }) => (
    <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
        <div className="flex items-start justify-between">
            <div className="p-3 bg-primary/20 rounded-lg">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            {trend && (
                <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                    {trend}
                </span>
            )}
        </div>
        <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    </div>
)

export function AdminDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 container">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gradient">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user?.name || 'Admin'}
                    </p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={Users} label="Total Users" value="12,543" trend="+12.5%" />
                <StatCard icon={Building} label="Active Theaters" value="48" trend="+3 New" />
                <StatCard icon={Film} label="Movies Listed" value="156" trend="+8 This Week" />
                <StatCard icon={TrendingUp} label="Total Revenue" value="$45,231" trend="+18.2%" />
            </div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity / Quick Actions Placeholder */}
                <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl h-full">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        Quick Actions
                    </h2>
                    <div className="space-y-4">
                        <Button className="w-full justify-start text-left" variant="outline">
                            <Users className="mr-2 h-4 w-4" /> Manage Users
                        </Button>
                        <Button className="w-full justify-start text-left" variant="outline">
                            <Building className="mr-2 h-4 w-4" /> Approve New Theaters
                        </Button>
                        <Button className="w-full justify-start text-left" variant="outline">
                            <Film className="mr-2 h-4 w-4" /> Add New Movie Category
                        </Button>
                    </div>
                </div>

                {/* System Status Placeholder */}
                <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl h-full">
                    <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                            <span className="text-sm font-medium">Server Status</span>
                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                            <span className="text-sm font-medium">Database Load</span>
                            <span className="text-xs text-muted-foreground">Normal (24%)</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                            <span className="text-sm font-medium">Last Backup</span>
                            <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
