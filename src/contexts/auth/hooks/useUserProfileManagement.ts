
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from '../types';
import { fetchUserProfile, mapSupabaseUserToUser, createInitialUserProfile } from '../utils';

export const useUserProfileManagement = () => {
  const [user, setUser] = useState<User | null>(null);

  const processUserSession = async (session: Session | null): Promise<User | null> => {
    if (!session?.user) {
      console.log("useUserProfileManagement: No session - clearing user");
      return null;
    }

    console.log("useUserProfileManagement: Processing session for user:", session.user.id);
    
    try {
      // Always create a basic user first for immediate UI response
      const basicUser = createBasicUser(session.user);
      
      // Try to fetch the enhanced profile in the background
      try {
        const userProfile = await Promise.race([
          fetchUserProfile(session.user.id),
          new Promise<null>((resolve) => 
            setTimeout(() => {
              console.warn('useUserProfileManagement: Profile fetch timeout, using basic user');
              resolve(null);
            }, 1500) // Quick timeout for profile fetch
          )
        ]);
        
        if (userProfile) {
          // Profile exists, return enhanced user
          const enhancedUser = mapSupabaseUserToUser(session.user, userProfile);
          console.log("useUserProfileManagement: Using enhanced user profile:", enhancedUser.email);
          return enhancedUser;
        } else {
          console.log("useUserProfileManagement: No profile found, creating basic user and background profile");
          
          // Create database profile in background (non-blocking)
          setTimeout(async () => {
            try {
              await createInitialUserProfile(session.user);
              console.log("useUserProfileManagement: Background profile creation completed");
            } catch (error) {
              console.warn("useUserProfileManagement: Background profile creation failed:", error);
            }
          }, 0);
          
          return basicUser;
        }
      } catch (profileError) {
        console.warn("useUserProfileManagement: Profile fetch failed, using basic user:", profileError);
        return basicUser;
      }
    } catch (error) {
      console.error("useUserProfileManagement: Session processing failed:", error);
      // Always return a basic user so the app can function
      return createBasicUser(session.user);
    }
  };

  const createBasicUser = (supabaseUser: any): User => {
    const email = supabaseUser.email || '';
    const fallbackName = supabaseUser.user_metadata?.name || 
                        supabaseUser.user_metadata?.full_name || 
                        email.split('@')[0] || 
                        'User';
    
    console.log('useUserProfileManagement: Creating basic user with name:', fallbackName);
    
    return {
      id: supabaseUser.id,
      email,
      name: fallbackName,
      points: 0,
      level: 1,
      levelPoints: 0,
      maxLevelPoints: 100,
      currentStreak: 0,
      longestStreak: 0,
      unlockedAchievements: [],
      tasksCompleted: 0,
      totalTasks: 0
    };
  };

  return {
    user,
    setUser,
    processUserSession
  };
};
