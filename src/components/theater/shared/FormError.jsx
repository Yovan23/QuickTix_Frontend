import { AlertCircle } from 'lucide-react';

/**
 * Form Error Component
 * Displays form validation errors
 */
export function FormError({ message }) {
    if (!message) return null;
    return (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
}
