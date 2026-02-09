import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Modal } from '../shared/Modal';
import { Monitor } from 'lucide-react';

/**
 * Add Screen Modal
 * Form for creating a new screen in a theatre
 */
export function AddScreenModal({
    isOpen,
    onClose,
    onSubmit,
    theatreName,
    loading
}) {
    const [form, setForm] = useState({ name: '', capacity: '' });

    useEffect(() => {
        if (isOpen) {
            setForm({ name: '', capacity: '' });
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        onSubmit(form);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Add Screen to ${theatreName}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="screen-name">Screen Name *</Label>
                    <Input
                        id="screen-name"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Screen 1, IMAX, Dolby"
                        className="mt-1"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="screen-capacity">Capacity (seats)</Label>
                    <Input
                        id="screen-capacity"
                        type="number"
                        value={form.capacity}
                        onChange={(e) => setForm(prev => ({ ...prev, capacity: e.target.value }))}
                        placeholder="Enter seating capacity"
                        className="mt-1"
                        min="1"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading || !form.name.trim()} className="flex-1">
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Monitor className="h-4 w-4 mr-2" />
                                Create Screen
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
