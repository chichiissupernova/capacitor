
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { GlobalErrorBoundary } from '@/components/errors/GlobalErrorBoundary';
import { AuthProvider } from '@/contexts/auth';
import { PageLoader } from '@/components/ui/page-loader';
import { queryClient } from '@/config/queryClient';
import { AppRoutes } from '@/components/routing/AppRoutes';
import { ConditionalBottomNav } from '@/components/routing/ConditionalBottomNav';

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="min-h-screen w-full">
              <Suspense fallback={<PageLoader />}>
                <AppRoutes />
              </Suspense>
              
              {/* Bottom Navigation - Fixed to viewport */}
              <ConditionalBottomNav />
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
