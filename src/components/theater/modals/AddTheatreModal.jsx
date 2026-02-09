import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Modal } from '../shared/Modal';
import { Building, Check } from 'lucide-react';

/**
 * Add Theatre Modal
 * Form for creating a new theatre
 */
export function AddTheatreModal({
    isOpen,
    onClose,
    onSubmit,
    cities,
    loading
}) {
    const [form, setForm] = useState({ name: '', address: '', cityId: '' });

    useEffect(() => {
        if (isOpen) {
            setForm({ name: '', address: '', cityId: '' });
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.cityId) return;
        onSubmit(form);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Theatre">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="theatre-name">Theatre Name *</Label>
                    <Input
                        id="theatre-name"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter theatre name"
                        className="mt-1"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="theatre-city">City *</Label>
                    <select
                        id="theatre-city"
                        value={form.cityId}
                        onChange={(e) => setForm(prev => ({ ...prev, cityId: e.target.value }))}
                        className="w-full mt-1 p-2 rounded-md bg-background border border-input"
                        required
                    >
                        <option value="">Select a city</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label htmlFor="theatre-address">Address</Label>
                    <Input
                        id="theatre-address"
                        value={form.address}
                        onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter theatre address"
                        className="mt-1"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading || !form.name.trim() || !form.cityId} className="flex-1">
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Building className="h-4 w-4 mr-2" />
                                Create Theatre
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
