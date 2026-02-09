/**
 * Tab Component
 * Navigation tab button with active state styling
 */
export function Tab({ active, children, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
        >
            {children}
        </button>
    );
}
