import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Modal } from './Modal';

/**
 * Delete Confirmation Modal
 * Reusable confirmation dialog for destructive actions
 */
export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemName,
    warningMessage,
    loading
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-red-500 font-medium">This action cannot be undone</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {warningMessage || `Deleting "${itemName}" will permanently remove it.`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="flex-1"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
