
import { useState, useEffect, useRef, useCallback } from 'react';
import { User, AuthState } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile, mapSupabaseUserToUser, createInitialUserProfile } from '../utils';

// Use this to ensure all hooks always called in the same order!
export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const mounted = useRef(true);
  const renderCount = useRef(0);
  const lastAuthState = useRef<AuthState | null>(null);

  // Track renders to detect infinite loops
  renderCount.current += 1;
  console.log(`🔄 useAuthState RENDER #${renderCount.current}`, {
    isLoading: authState.isLoading,
    hasUser: !!authState.user,
    userEmail: authState.user?.email,
    error: authState.error?.message
  });

  // Detect infinite re-renders
  if (renderCount.current > 50) {
    console.error('🚨 INFINITE RENDER LOOP DETECTED in useAuthState!');
    console.error('Current state:', authState);
    console.error('Last state:', lastAuthState.current);
  }

  // Stable profile loader function
  const loadUserProfile = useCallback(async (supabaseUser: any): Promise<User | null> => {
    const startTime = Date.now();
    console.log('🔍 loadUserProfile: STARTING', {
      userId: supabaseUser?.id,
      timestamp: new Date().toISOString()
    });

    if (!supabaseUser) {
      console.error('❌ loadUserProfile: Called without a valid supabaseUser!');
      return null;
    }
    
    console.log(`📋 loadUserProfile: Starting profile load for user: ${supabaseUser.id}`);
    
    try {
      // First attempt to fetch the user profile
      console.log('🔍 loadUserProfile: Attempting to fetch existing profile');
      const userProfile = await fetchUserProfile(supabaseUser.id);
      
      if (userProfile) {
        const loadTime = Date.now() - startTime;
        console.log('✅ loadUserProfile: Profile found successfully', {
          id: userProfile.id,
          points: userProfile.points,
          currentStreak: userProfile.current_streak,
          level: userProfile.level,
          loadTimeMs: loadTime
        });
        const mappedUser = mapSupabaseUserToUser(supabaseUser, userProfile);
        console.log('🗺️ loadUserProfile: User mapped', {
          mappedPoints: mappedUser.points,
          mappedLevel: mappedUser.level,
          mappedStreak: mappedUser.currentStreak
        });
        return mappedUser;
      }

      // No profile found, create one
      console.log('➕ loadUserProfile: No profile found, creating new profile');
      const newProfile = await createInitialUserProfile(supabaseUser);
      
      if (newProfile) {
        const loadTime = Date.now() - startTime;
        console.log('✅ loadUserProfile: New profile created successfully', {
          loadTimeMs: loadTime
        });
        const mappedUser = mapSupabaseUserToUser(supabaseUser, newProfile);
        return mappedUser;
      }

      // If profile creation fails, create a basic temporary user
      console.warn('⚠️ loadUserProfile: Profile creation failed, creating temporary user');
      const temporaryUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || 
              supabaseUser.user_metadata?.full_name || 
              supabaseUser.email?.split('@')[0] || 
              'User',
        points: 0,
        level: 1,
        levelPoints: 0,
        maxLevelPoints: 100,
        currentStreak: 0,
        longestStreak: 0,
        unlockedAchievements: [],
        tasksCompleted: 0,
        totalTasks: 0,
        isTemporary: true
      };
      
      const loadTime = Date.now() - startTime;
      console.log('🔄 loadUserProfile: Returning temporary user', {
        loadTimeMs: loadTime
      });
      return temporaryUser;

    } catch (error) {
      const loadTime = Date.now() - startTime;
      console.error('❌ loadUserProfile: Error during profile loading', {
        error,
        loadTimeMs: loadTime
      });
      
      // Create temporary user as fallback
      const temporaryUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || 
              supabaseUser.user_metadata?.full_name || 
              supabaseUser.email?.split('@')[0] || 
              'User',
        points: 0,
        level: 1,
        levelPoints: 0,
        maxLevelPoints: 100,
        currentStreak: 0,
        longestStreak: 0,
        unlockedAchievements: [],
        tasksCompleted: 0,
        totalTasks: 0,
        isTemporary: true
      };
      
      console.log('🔄 loadUserProfile: Returning temporary user due to error');
      return temporaryUser;
    }
  }, []); // Empty dependency array - this function is stable

  // Handle Supabase auth state initialization and profile loading
  useEffect(() => {
    console.log('🚀 useAuthState: Setting up auth management');
    mounted.current = true;

    // -- Auth event handler: synchronous-only, cannot be async --
    const handleAuthStateChange = (event: string, session: any) => {
      console.log(`🔑 Auth event: ${event}`, {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        mounted: mounted.current
      });

      if (!mounted.current) {
        console.log('⚠️ Auth event ignored - component unmounted');
        return;
      }

      // Only update isLoading in the callback. User/profile updates happen after.
      console.log('⏳ Setting loading state to true');
      setAuthState(prev => {
        const newState = {
          ...prev,
          isLoading: true,
          error: null
        };
        console.log('📝 Auth state update (loading)', { prev, new: newState });
        return newState;
      });

      // Defer Supabase profile calls to avoid React hook deadlocks
      if (session?.user) {
        console.log('👤 User detected, scheduling profile load');
        setTimeout(() => {
          console.log('🔍 Starting profile load for user:', session.user.id);
          loadUserProfile(session.user)
            .then(userProfile => {
              if (mounted.current) {
                console.log('✅ Profile loaded successfully', {
                  userId: userProfile?.id,
                  points: userProfile?.points,
                  level: userProfile?.level
                });
                setAuthState(prev => {
                  const newState = { user: userProfile, isLoading: false, error: null };
                  console.log('📝 Auth state update (user loaded)', { prev, new: newState });
                  return newState;
                });
              } else {
                console.log('⚠️ Profile load completed but component unmounted');
              }
            })
            .catch(error => {
              console.error('❌ Profile load failed:', error);
              if (mounted.current) {
                setAuthState(prev => {
                  const newState = { user: null, isLoading: false, error: error as Error };
                  console.log('📝 Auth state update (error)', { prev, new: newState });
                  return newState;
                });
              }
            });
        }, 0);
      } else {
        // Signed out / no session
        console.log('🚪 No session - user signed out');
        setAuthState(prev => {
          const newState = { user: null, isLoading: false, error: null };
          console.log('📝 Auth state update (signed out)', { prev, new: newState });
          return newState;
        });
      }
    };

    // Always set up auth listener before fetching initial session!
    console.log('👂 Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      handleAuthStateChange
    );

    // Initial session fetch
    console.log('🔍 Fetching initial session');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Initial session fetch error:', error);
        setAuthState(prev => {
          const newState = { user: null, isLoading: false, error };
          console.log('📝 Auth state update (initial error)', { prev, new: newState });
          return newState;
        });
      } else {
        console.log('📋 Initial session fetched, triggering auth change');
        handleAuthStateChange('INITIAL_SESSION', session);
      }
    });

    // Cleanup on unmount
    return () => {
      console.log('🧹 useAuthState cleanup');
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile]); // Now loadUserProfile is stable

  // Track state changes
  useEffect(() => {
    if (JSON.stringify(lastAuthState.current) !== JSON.stringify(authState)) {
      console.log('🔄 Auth state changed:', {
        from: lastAuthState.current,
        to: authState,
        renderCount: renderCount.current
      });
      lastAuthState.current = { ...authState };
    }
  }, [authState]);

  // Synchronous state handlers for external use
  const setUser = (user: User | null) => {
    console.log('🎯 Manual setUser called', { userId: user?.id, points: user?.points });
    setAuthState(prev => ({
      ...prev,
      user,
      error: null,
      isLoading: false
    }));
  };

  const setIsLoading = (isLoading: boolean) => {
    console.log('⏳ Manual setIsLoading called', { isLoading });
    setAuthState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: Error | null) => {
    console.error('❌ Manual setError called', { error: error?.message });
    setAuthState(prev => ({ ...prev, error, isLoading: false }));
  };

  const clearError = () => {
    console.log('🧹 Manual clearError called');
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    setUser,
    setIsLoading,
    setError,
    clearError
  };
};
