import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Bundle critical components instead of lazy loading
import Dashboard from '@/pages/Dashboard';
import MainLayout from '@/components/layout/MainLayout';

// Only lazy load less critical pages
const Login = React.lazy(() => import('@/pages/Login'));
const Calendar = React.lazy(() => import('@/pages/Calendar'));
const ContentPlan = React.lazy(() => import('@/pages/ContentPlan'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const PublicProfile = React.lazy(() => import('@/pages/PublicProfile'));
const CreatorConnect = React.lazy(() => import('@/pages/CreatorConnect'));
const Messages = React.lazy(() => import('@/pages/Messages'));
const Notes = React.lazy(() => import('@/pages/Notes'));
const BrandVault = React.lazy(() => import('@/pages/BrandVault'));
const FollowingFeed = React.lazy(() => import('@/pages/FollowingFeed'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const UpdatePassword = React.lazy(() => import('@/pages/UpdatePassword'));
const ResetPassword = React.lazy(() => import('@/pages/ResetPassword'));
const ChallengeInvite = React.lazy(() => import('@/pages/ChallengeInvite'));
const ChallengeJoin = React.lazy(() => import('@/pages/ChallengeJoin'));

// Faster loading fallback
const FastSuspenseFallback = () => (
  <div className="p-4 flex justify-center">
    <LoadingSpinner size="md" />
  </div>
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={
        <Suspense fallback={<FastSuspenseFallback />}>
          <Login />
        </Suspense>
      } />
      <Route path="/reset-password" element={
        <Suspense fallback={<FastSuspenseFallback />}>
          <ResetPassword />
        </Suspense>
      } />
      <Route path="/update-password" element={
        <Suspense fallback={<FastSuspenseFallback />}>
          <UpdatePassword />
        </Suspense>
      } />
      <Route path="/challenge/:token" element={
        <Suspense fallback={<FastSuspenseFallback />}>
          <ChallengeInvite />
        </Suspense>
      } />
      <Route path="/challenge-join/:token" element={
        <Suspense fallback={<FastSuspenseFallback />}>
          <ChallengeJoin />
        </Suspense>
      } />
      <Route path="/u/:username" element={
        <Suspense fallback={<FastSuspenseFallback />}>
          <PublicProfile />
        </Suspense>
      } />
      
      {/* Critical dashboard route - no lazy loading */}
      <Route 
        path="/dashboard" 
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } 
      />
      
      {/* Other routes with lazy loading */}
      <Route 
        path="/calendar" 
        element={
          <MainLayout>
            <Suspense fallback={<FastSuspenseFallback />}>
              <Calendar />
            </Suspense>
          </MainLayout>
        } 
      />
      <Route 
        path="/content-plan" 
        element={
          <MainLayout>
            <Suspense fallback={<FastSuspenseFallback />}>
              <ContentPlan />
            </Suspense>
          </MainLayout>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <MainLayout>
            <Suspense fallback={<FastSuspenseFallback />}>
              <Profile />
            </Suspense>
          </MainLayout>
        } 
      />
      <Route 
        path="/brand-vault" 
        element={
          <MainLayout>
            <Suspense fallback={<FastSuspenseFallback />}>
              <BrandVault />
            </Suspense>
          </MainLayout>
        } 
      />
      <Route 
        path="/creator-connect" 
        element={
          <MainLayout>
            <Suspense fallback={<FastSuspenseFallback />}>
              <CreatorConnect />
            </Suspense>
          </MainLayout>
        } 
      />
      <Route 
        path="/messages" 
        element={
          <MainLayout>
            <Suspense fallback={<FastSuspenseFallback />}>
              <Messages />
            </Suspense>
          </MainLayout>
        } 
      />
      <Route 
        path="/notes" 
        element={
          <MainLayout>
            <Suspense fallback={<FastSuspenseFallback />}>
              <Notes />
            </Suspense>
          </MainLayout>
        } 
      />
      <Route 
        path="/following" 
        element={
          <MainLayout>
            <Suspense fallback={<FastSuspenseFallback />}>
              <FollowingFeed />
            </Suspense>
          </MainLayout>
        } 
      />
      <Route path="*" element={
        <Suspense fallback={<FastSuspenseFallback />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
}
