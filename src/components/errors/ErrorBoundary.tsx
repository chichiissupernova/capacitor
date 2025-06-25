
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { reportLogs } from '@/utils/errorLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  withToast?: boolean;
  silent?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle errors in the component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static defaultProps = {
    withToast: true,
    silent: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({ errorInfo });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error logging service
    if (this.props.silent !== true) {
      // Try to get user ID for better error tracking
      let userId = 'unknown';
      try {
        const user = JSON.parse(localStorage.getItem('chichi_user') || '{}');
        if (user?.id) {
          userId = user.id;
        }
      } catch (e) {
        // Ignore parse errors
      }
      
      reportLogs(userId, 'error_boundary');
    }

    // Show toast notification
    if (this.props.withToast) {
      toast({
        title: 'Something went wrong',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  }

  public resetError = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-background rounded-lg border border-border shadow-sm">
          <div className="w-full text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              We're sorry, but there was an error in this part of the application.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-muted p-4 rounded-md mb-4 overflow-auto max-h-48 text-left">
                <p className="text-sm font-mono mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-xs">{this.state.errorInfo.componentStack}</pre>
                )}
              </div>
            )}
            
            <Button onClick={this.resetError}>Try Again</Button>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}
