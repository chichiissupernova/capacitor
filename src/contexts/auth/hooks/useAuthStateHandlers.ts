
import { User, AuthState } from '../types';

export const useAuthStateHandlers = (
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const setUser = (user: User | null) => {
    console.log('useAuthStateHandlers: Setting user directly:', user ? { 
      id: user.id, 
      points: user.points, 
      currentStreak: user.currentStreak,
      isTemporary: user.isTemporary 
    } : null);
    
    setAuthState(prev => ({ 
      ...prev, 
      user,
      error: null,
      isLoading: false // Ensure loading is false when setting user directly
    }));
  };

  const setIsLoading = (isLoading: boolean) => {
    console.log('useAuthStateHandlers: Setting loading state:', isLoading);
    setAuthState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: Error | null) => {
    console.log('useAuthStateHandlers: Setting error:', error?.message);
    setAuthState(prev => ({ ...prev, error, isLoading: false }));
  };

  const clearError = () => {
    console.log('useAuthStateHandlers: Clearing error');
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    setUser,
    setIsLoading,
    setError,
    clearError
  };
};
