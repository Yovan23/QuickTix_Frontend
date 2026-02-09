import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, ChevronDown } from 'lucide-react';

/**
 * Reusable form select component with label and error handling
 * Works seamlessly with react-hook-form
 */
const FormSelect = forwardRef(
    (
        {
            label,
            error,
            options = [],
            placeholder = 'Select an option',
            className,
            containerClassName,
            labelClassName,
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
                <div className="relative">
                    <select
                        ref={ref}
                        id={id}
                        className={cn(
                            'w-full h-10 px-3 pr-10 rounded-md appearance-none',
                            'bg-secondary/50 border border-white/10',
                            'text-white text-sm',
                            'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                            className
                        )}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : undefined}
                        {...props}
                    >
                        <option value="" disabled>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-gray-900"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
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

FormSelect.displayName = 'FormSelect';

export { FormSelect };
