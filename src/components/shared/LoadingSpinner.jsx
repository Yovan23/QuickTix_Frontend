import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Reusable loading spinner component
 */
export function LoadingSpinner({
    size = 'default',
    className,
    text,
    fullScreen = false,
}) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        default: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const Spinner = (
        <div className={cn('flex flex-col items-center gap-3', className)}>
            <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
            {text && <p className="text-muted-foreground text-sm">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {Spinner}
            </div>
        );
    }

    return Spinner;
}
