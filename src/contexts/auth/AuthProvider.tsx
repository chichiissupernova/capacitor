
import React from 'react';
import { AuthContextType } from './types';
import { AuthContext } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError
  } = useAuthState();

  const {
    signUp,
    signIn,
    signOut,
    updateUserPoints,
    updateUserData,
    updateUserName,
    updateUserAvatar,
    refreshUser,
    updateUserStreak,
    completeTask,
    resetPassword,
    updatePassword
  } = useAuthActions(user, setUser, setIsLoading, setError, clearError);

  const value: AuthContextType = {
    user,
    isLoading,
    loading: isLoading,
    isAuthenticated: !!user,
    error,
    signUp,
    signIn,
    signOut,
    login: signIn,
    signup: (email: string, password: string, name?: string) => signUp(email, password, name || email.split('@')[0]),
    logout: signOut,
    updateUserPoints,
    updateUserData,
    updateUserName,
    updateUserAvatar,
    refreshUser,
    updateUserStreak,
    completeTask,
    resetPassword,
    updatePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
