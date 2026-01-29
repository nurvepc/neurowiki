import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              ⚠️ Error Caught
            </h1>
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <h2 className="font-bold text-red-700">Error Message:</h2>
              <pre className="text-sm text-red-900 whitespace-pre-wrap mt-2">
                {this.state.error?.toString()}
              </pre>
            </div>
            <div className="bg-gray-100 border-l-4 border-gray-500 p-4">
              <h2 className="font-bold text-gray-700">Stack Trace:</h2>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap mt-2 overflow-auto max-h-96">
                {this.state.error?.stack}
              </pre>
            </div>
            {this.state.errorInfo && (
              <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mt-4">
                <h2 className="font-bold text-blue-700">Component Stack:</h2>
                <pre className="text-xs text-blue-900 whitespace-pre-wrap mt-2 overflow-auto max-h-96">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
