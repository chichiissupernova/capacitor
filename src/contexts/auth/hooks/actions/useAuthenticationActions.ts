
import { toast } from '@/hooks/use-toast';
import { User } from '../../types';
import { AuthService } from '../../services/authService';

export const useAuthenticationActions = (
  setUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  clearError: () => void
) => {
  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    try {
      await AuthService.signUp(email, password, name);
    } catch (error: any) {
      console.error("Sign up failed:", error);
      setError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    try {
      await AuthService.signIn(email, password);
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.resetPassword(email);
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.updatePassword(password);
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
};
