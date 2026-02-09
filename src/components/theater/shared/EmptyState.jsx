import { Button } from '@/components/ui/button';

/**
 * Empty State Component
 * Displays when there's no data to show
 */
export function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {Icon && <Icon className="h-12 w-12 text-muted-foreground mb-4" />}
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            {description && <p className="text-muted-foreground mt-1 max-w-sm">{description}</p>}
            {action && (
                <Button onClick={action} className="mt-4">
                    {actionLabel || 'Add New'}
                </Button>
            )}
        </div>
    );
}
