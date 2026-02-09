import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';

/**
 * Cities Tab - City CRUD management
 */
export function CitiesTab({
    cities,
    onAdd,
    onEdit,
    onDelete,
    actionLoading
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Manage Cities
                </h2>
                <Button onClick={onAdd} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add City
                </Button>
            </div>

            {cities.length === 0 ? (
                <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-12 rounded-xl text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">No cities yet</p>
                    <p className="text-muted-foreground mb-4">Add cities to enable theatre registration.</p>
                    <Button onClick={onAdd}>Add First City</Button>
                </div>
            ) : (
                <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-black/20">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">City Name</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">State</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Country</th>
                                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cities.map((city) => (
                                <tr key={city.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-muted-foreground">{city.id}</td>
                                    <td className="p-4 font-medium text-foreground">{city.name}</td>
                                    <td className="p-4 text-muted-foreground">{city.state || 'N/A'}</td>
                                    <td className="p-4 text-muted-foreground">{city.country || 'N/A'}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEdit(city)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-400 hover:text-red-300"
                                                onClick={() => onDelete(city.id)}
                                                disabled={actionLoading === `delete-city-${city.id}`}
                                            >
                                                {actionLoading === `delete-city-${city.id}` ? (
                                                    <LoadingSpinner size="sm" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
