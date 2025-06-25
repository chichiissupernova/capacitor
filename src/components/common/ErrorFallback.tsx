
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            We encountered an unexpected error. This has been logged and our team will look into it.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-gray-50 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all">
                {error.message}
              </pre>
            </details>
          )}
          
          <div className="flex gap-2 justify-center">
            <Button onClick={resetError} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
