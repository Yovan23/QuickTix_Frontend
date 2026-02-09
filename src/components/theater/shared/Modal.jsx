import { X } from 'lucide-react';

/**
 * Reusable Modal Component
 * A centered modal with backdrop, title, and close button
 */
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-background border border-white/10 rounded-xl w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
                <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
