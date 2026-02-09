import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable form input component with label and error handling
 * Works seamlessly with react-hook-form
 */
const FormInput = forwardRef(
    (
        {
            label,
            error,
            className,
            containerClassName,
            labelClassName,
            type = 'text',
            required = false,
            ...props
        },
        ref
    ) => {
        const id = props.id || props.name;

        return (
            <div className={cn('space-y-2', containerClassName)}>
                {label && (
                    <label
                        htmlFor={id}
                        className={cn(
                            'text-sm font-medium text-gray-200',
                            labelClassName
                        )}
                    >
                        {label}
                        {required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <Input
                    ref={ref}
                    id={id}
                    type={type}
                    className={cn(
                        'bg-secondary/50 border-white/10 focus:border-primary text-white',
                        error && 'border-red-500 focus:border-red-500',
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    {...props}
                />
                {error && (
                    <div
                        id={`${id}-error`}
                        className="flex items-center gap-1.5 text-sm text-red-400"
                        role="alert"
                    >
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export { FormInput };
