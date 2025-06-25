
import { toast } from '@/hooks/use-toast';
import { User } from '../../types';
import { UserService } from '../../services/userService';

export const useUserActions = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void
) => {
  const refreshUser = async (): Promise<void> => {
    if (!user) return;
    try {
      console.log("Refreshing user data...");
      // Always fetch latest user from backend after any update
      const refreshedUser = await UserService.refreshUser(user.id);
      if (refreshedUser) {
        console.log("User data refreshed successfully:", refreshedUser.points);
        setUser(refreshedUser);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      setError(error instanceof Error ? error : new Error("Failed to refresh user"));
    }
  };

  const updateUserData = async (userData: Partial<User>): Promise<void> => {
    if (!user) {
      return;
    }
    setIsLoading(true);
    try {
      await UserService.updateUserData(user, userData);
      await refreshUser();
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserName = async (name: string): Promise<void> => {
    await updateUserData({ name });
  };

  const updateUserAvatar = async (avatarUrl: string): Promise<void> => {
    await updateUserData({ avatarUrl });
  };

  return {
    refreshUser,
    updateUserData,
    updateUserName,
    updateUserAvatar
  };
};
