
import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load BottomNav
const BottomNav = React.lazy(() => import('@/components/layout/BottomNav'));

// Optimized loading fallback for layout components
const LayoutSuspenseFallback = () => (
  <div className="p-2">
    <LoadingSpinner size="sm" />
  </div>
);

// Enhanced component to conditionally render BottomNav
export function ConditionalBottomNav() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Routes that should show the bottom navigation - including root route
  const protectedRoutes = [
    '/',
    '/dashboard',
    '/calendar',
    '/content-plan',
    '/profile',
    '/brand-vault',
    '/creator-connect',
    '/messages',
    '/notes',
    '/following'
  ];
  
  const isProtectedRoute = protectedRoutes.includes(location.pathname);
  
  // Only show BottomNav if user is authenticated and on a protected route
  const shouldShowBottomNav = user && !isLoading && isProtectedRoute;
  
  if (shouldShowBottomNav) {
    return (
      <Suspense fallback={<LayoutSuspenseFallback />}>
        <BottomNav />
      </Suspense>
    );
  }
  
  return null;
}
