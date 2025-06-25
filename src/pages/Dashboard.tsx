
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useAuth } from '@/contexts/auth/useAuth';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useUpcomingPosts } from '@/hooks/useUpcomingPosts';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';

const Dashboard = memo(() => {
  const { user, isLoading } = useAuth();
  const { canRecoverStreak, tasks } = useDailyTasks();
  const [betaVersion] = useState("2.1");
  
  // Use our custom hook to handle posts with auto-refresh
  const { upcomingPosts, isLoadingPosts, handleCompletePost, refreshPosts } = useUpcomingPosts(user?.id);
  
  // Memoize the refresh callback to prevent unnecessary re-renders
  const memoizedRefreshPosts = useCallback(() => {
    if (user?.id) {
      refreshPosts();
    }
  }, [user?.id, refreshPosts]);
  
  // Initial refresh when user changes - debounced
  useEffect(() => {
    let timeoutId: number;
    
    if (user?.id) {
      timeoutId = window.setTimeout(() => {
        memoizedRefreshPosts();
      }, 200);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user?.id, memoizedRefreshPosts]);
  
  // Refresh posts when primary task is completed - with enhanced debouncing
  useEffect(() => {
    let timeoutId: number;
    
    if (user?.id) {
      const postTask = tasks.find(task => task.id === 'post');
      if (postTask?.completed) {
        // Enhanced debouncing to prevent conflicts
        timeoutId = window.setTimeout(() => {
          memoizedRefreshPosts();
        }, 1000);
      }
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [tasks, user?.id, memoizedRefreshPosts]);

  // Enhanced event listeners for calendar task updates with better debouncing
  useEffect(() => {
    if (!user?.id) return;

    let refreshTimeoutId: number;
    
    const debouncedRefresh = () => {
      if (refreshTimeoutId) {
        clearTimeout(refreshTimeoutId);
      }
      refreshTimeoutId = window.setTimeout(() => {
        memoizedRefreshPosts();
      }, 800);
    };

    const handleCalendarTaskAdded = (event: any) => {
      debouncedRefresh();
    };

    const handleUpcomingPostsRefresh = () => {
      debouncedRefresh();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'calendar_task_added') {
        debouncedRefresh();
        localStorage.removeItem('calendar_task_added');
      }
    };

    // Multiple event listeners to ensure we catch calendar updates
    window.addEventListener('calendar_task_added', handleCalendarTaskAdded);
    window.addEventListener('upcoming-posts-refresh', handleUpcomingPostsRefresh);
    window.addEventListener('storage', handleStorageChange);

    // Check for any pending storage events on mount
    const pendingEvent = localStorage.getItem('calendar_task_added');
    if (pendingEvent) {
      debouncedRefresh();
      localStorage.removeItem('calendar_task_added');
    }

    return () => {
      window.removeEventListener('calendar_task_added', handleCalendarTaskAdded);
      window.removeEventListener('upcoming-posts-refresh', handleUpcomingPostsRefresh);
      window.removeEventListener('storage', handleStorageChange);
      if (refreshTimeoutId) {
        clearTimeout(refreshTimeoutId);
      }
    };
  }, [user?.id, memoizedRefreshPosts]);
  
  // User stats with proper fallbacks for streak values
  const userStats = {
    currentStreak: typeof user?.currentStreak === 'number' ? user.currentStreak : 0,
    longestStreak: typeof user?.longestStreak === 'number' ? user.longestStreak : 0,
    totalPoints: user?.points ?? 0,
    levelPoints: user?.levelPoints ?? 0,
    maxLevelPoints: user?.maxLevelPoints ?? 100,
    level: user?.level ?? 1,
    tasksCompleted: tasks.filter(t => t.completed).length,
    totalTasks: tasks.length,
  };

  // Show loading state while user data is being loaded
  if (isLoading) {
    return (
      <div className="animate-fade-in pb-2 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chichi-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading state if no user data yet
  if (!user) {
    return (
      <div className="animate-fade-in pb-2 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chichi-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-2 transition-all duration-300">
      {/* Header banner with minimal margins on mobile */}
      <DashboardHeader />
      
      {/* Content with tighter spacing on mobile and smooth transitions */}
      <DashboardContent 
        userStats={userStats}
        canRecoverStreak={canRecoverStreak}
        upcomingPosts={upcomingPosts}
        isLoadingPosts={isLoadingPosts}
        handleCompletePost={handleCompletePost}
      />
      
      {/* Footer with beta version and sync status */}
      <DashboardFooter betaVersion={betaVersion} />
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
