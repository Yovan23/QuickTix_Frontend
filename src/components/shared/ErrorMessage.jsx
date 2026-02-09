import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Reusable error message component
 */
export function ErrorMessage({
    title = 'Something went wrong',
    message,
    onRetry,
    className,
    fullScreen = false,
}) {
    const Content = (
        <div className={cn('flex flex-col items-center gap-4 text-center p-8', className)}>
            <div className="p-4 rounded-full bg-red-500/10">
                <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
                {message && (
                    <p className="text-muted-foreground text-sm">{message}</p>
                )}
            </div>
            {onRetry && (
                <Button variant="outline" onClick={onRetry} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {Content}
            </div>
        );
    }

    return Content;
}
