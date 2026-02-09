import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

/**
 * Dashboard Stats Card Component
 * Displays a statistic with icon, label, value, and optional trend indicator
 */
export function StatCard({ icon: Icon, label, value, trend, loading }) {
    return (
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
                {loading ? (
                    <div className="h-8 w-20 bg-muted/30 rounded animate-pulse" />
                ) : (
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                )}
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </div>
    );
}
