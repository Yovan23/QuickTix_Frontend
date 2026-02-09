import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Modal, FormError } from '../shared';
import { Check, DollarSign } from 'lucide-react';

/**
 * Add Show Modal
 * Form for scheduling a new show
 */
export function AddShowModal({
    isOpen,
    onClose,
    onSubmit,
    screenName,
    movies,
    layouts,
    loading,
    errors,
    onValidate
}) {
    const [form, setForm] = useState({
        layoutId: '',
        movieId: '',
        startTime: '',
        endTime: '',
        language: 'English',
        format: '2D',
        notes: '',
        pricing: { silver: '150', gold: '250', platinum: '350', diamond: '500' }
    });

    useEffect(() => {
        if (isOpen) {
            setForm({
                layoutId: '',
                movieId: '',
                startTime: '',
                endTime: '',
                language: 'English',
                format: '2D',
                notes: '',
                pricing: { silver: '150', gold: '250', platinum: '350', diamond: '500' }
            });
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const handlePricingChange = (type, value) => {
        setForm(prev => ({
            ...prev,
            pricing: { ...prev.pricing, [type]: value }
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Schedule Show - ${screenName}`} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Movie Selection */}
                <div>
                    <Label>Movie *</Label>
                    <select
                        value={form.movieId}
                        onChange={(e) => setForm(prev => ({ ...prev, movieId: e.target.value }))}
                        className="w-full mt-1 p-2 rounded-md bg-background border border-input"
                        required
                    >
                        <option value="">Select a movie</option>
                        {movies.map(movie => (
                            <option key={movie.id} value={movie.id}>{movie.title}</option>
                        ))}
                    </select>
                    <FormError message={errors?.movieId} />
                </div>

                {/* Layout Selection */}
                <div>
                    <Label>Seating Layout *</Label>
                    <select
                        value={form.layoutId}
                        onChange={(e) => setForm(prev => ({ ...prev, layoutId: e.target.value }))}
                        className="w-full mt-1 p-2 rounded-md bg-background border border-input"
                        required
                    >
                        <option value="">Select a layout</option>
                        {layouts.map((layout, idx) => {
                            // Backend returns: id, layoutName, totalRows, totalColumns, totalSeats
                            const id = layout.id || layout.layoutId || layout._id || idx;
                            const name = layout.layoutName || layout.name || `Layout ${idx + 1}`;
                            const rows = layout.totalRows ?? '?';
                            const cols = layout.totalColumns ?? '?';
                            const seats = layout.totalSeats ?? '';
                            return (
                                <option key={id} value={id}>
                                    {name} ({rows}×{cols}{seats ? ` - ${seats} seats` : ''})
                                </option>
                            );
                        })}
                    </select>
                    <FormError message={errors?.layoutId} />
                    {layouts.length === 0 && (
                        <p className="text-xs text-yellow-500 mt-1">
                            No layouts available. Create a layout first.
                        </p>
                    )}
                </div>

                {/* Date/Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Start Time *</Label>
                        <Input
                            type="datetime-local"
                            value={form.startTime}
                            onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                            className="mt-1"
                            required
                        />
                        <FormError message={errors?.startTime} />
                    </div>
                    <div>
                        <Label>End Time</Label>
                        <Input
                            type="datetime-local"
                            value={form.endTime}
                            onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                            className="mt-1"
                        />
                        <FormError message={errors?.endTime} />
                    </div>
                </div>

                {/* Language & Format */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Language</Label>
                        <select
                            value={form.language}
                            onChange={(e) => setForm(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full mt-1 p-2 rounded-md bg-background border border-input"
                        >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Telugu">Telugu</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Kannada">Kannada</option>
                            <option value="Malayalam">Malayalam</option>
                            <option value="Marathi">Marathi</option>
                        </select>
                    </div>
                    <div>
                        <Label>Format</Label>
                        <select
                            value={form.format}
                            onChange={(e) => setForm(prev => ({ ...prev, format: e.target.value }))}
                            className="w-full mt-1 p-2 rounded-md bg-background border border-input"
                        >
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                            <option value="4DX">4DX</option>
                            <option value="Dolby">Dolby Atmos</option>
                        </select>
                    </div>
                </div>

                {/* Pricing */}
                <div>
                    <Label className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4" />
                        Ticket Pricing (₹)
                    </Label>
                    <div className="grid grid-cols-4 gap-3">
                        {['silver', 'gold', 'platinum', 'diamond'].map((type) => (
                            <div key={type}>
                                <Label className="text-xs capitalize">{type}</Label>
                                <Input
                                    type="number"
                                    value={form.pricing[type]}
                                    onChange={(e) => handlePricingChange(type, e.target.value)}
                                    className="mt-1"
                                    min="0"
                                />
                            </div>
                        ))}
                    </div>
                    <FormError message={errors?.pricing} />
                </div>

                {/* Notes */}
                <div>
                    <Label>Notes</Label>
                    <textarea
                        value={form.notes}
                        onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional notes..."
                        rows={2}
                        className="mt-1 w-full p-2 rounded-md bg-background border border-input resize-none"
                    />
                </div>

                {/* Submit Error */}
                <FormError message={errors?.submit} />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading || layouts.length === 0} className="flex-1">
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Schedule Show
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
