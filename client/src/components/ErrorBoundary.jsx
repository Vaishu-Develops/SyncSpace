import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-full text-slate-400 p-8">
                    <div className="flex flex-col items-center gap-4 text-center max-w-md">
                        <div className="text-red-500 text-4xl">⚠️</div>
                        <h2 className="text-lg font-semibold text-slate-300">
                            Something went wrong with the editor
                        </h2>
                        <p className="text-sm text-slate-400">
                            The document editor encountered an error and needs to be reloaded.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
                        >
                            Reload Page
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 text-xs text-left w-full">
                                <summary className="cursor-pointer text-slate-400">Error Details</summary>
                                <pre className="mt-2 p-2 bg-slate-800 rounded text-red-400 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;