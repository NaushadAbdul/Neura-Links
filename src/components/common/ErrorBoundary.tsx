import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React UI error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetState = () => {
    localStorage.removeItem('nlbc_current_user');
    window.location.href = '/login';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#161616] text-[#F2F1ED] flex items-center justify-center p-6 font-inconsolata">
          <div className="max-w-md w-full bg-[#1e1e1e] border border-[#710014] p-6 rounded-lg shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-950/80 border border-rose-800 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="font-heading text-lg font-bold text-[#F2F1ED] uppercase tracking-wider">
                Application Runtime Notice
              </h2>
              <p className="text-xs text-gray-400">
                An unexpected UI state transition occurred. You can refresh the page or return to the sign in screen.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#161616] border border-[#2a2224] rounded text-[11px] text-rose-300 font-mono text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 bg-[#710014] hover:bg-[#90001a] text-white font-heading text-xs uppercase tracking-wider font-bold rounded-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleResetState}
                className="flex-1 py-2.5 bg-[#161616] hover:bg-[#252535] border border-[#2a2224] text-gray-300 font-heading text-xs uppercase tracking-wider rounded-md transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
