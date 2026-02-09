import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Pending Owners Tab - Owner approval/rejection management
 */
export function PendingOwnersTab({
    pendingOwners,
    onApprove,
    onReject,
    actionLoading
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Pending Theatre Owner Applications</h2>

            {pendingOwners.length === 0 ? (
                <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-12 rounded-xl text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">All caught up!</p>
                    <p className="text-muted-foreground">No pending applications to review.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingOwners.map((owner) => (
                        <div key={owner.ownerId} className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        {owner.userName || `Owner #${owner.ownerId}`}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {owner.userEmail || 'No email'} • Applied: {owner.createdAt ? new Date(owner.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-green-400 border-green-400/50 hover:bg-green-400/10"
                                        onClick={() => onApprove(owner.ownerId)}
                                        disabled={actionLoading === `approve-${owner.ownerId}`}
                                    >
                                        {actionLoading === `approve-${owner.ownerId}` ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approve
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                                        onClick={() => onReject(owner.ownerId)}
                                        disabled={actionLoading === `reject-${owner.ownerId}`}
                                    >
                                        {actionLoading === `reject-${owner.ownerId}` ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
