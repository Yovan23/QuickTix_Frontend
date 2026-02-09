import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                        <p className="text-neutral-400 mb-6">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>

                        <div className="bg-neutral-900/50 p-4 rounded-lg text-left mb-6 overflow-hidden">
                            <p className="text-xs text-red-400 font-mono break-words">
                                {this.state.error?.toString()}
                            </p>
                        </div>

                        <button
                            onClick={this.handleReload}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
