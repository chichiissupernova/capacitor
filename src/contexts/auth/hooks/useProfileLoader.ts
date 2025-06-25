import { useState } from 'react';
import { User } from '../types';
import { fetchUserProfile, mapSupabaseUserToUser, createInitialUserProfile } from '../utils';

export const useProfileLoader = () => {
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // This function is now moved to useAuthState to prevent circular dependencies
  // Keeping this hook for backward compatibility but the actual logic is in useAuthState
  const loadUserProfile = async (supabaseUser: any): Promise<User | null> => {
    console.warn('⚠️ useProfileLoader.loadUserProfile called - this should be handled by useAuthState now');
    return null;
  };

  return {
    loadUserProfile,
    isProfileLoading
  };
};
