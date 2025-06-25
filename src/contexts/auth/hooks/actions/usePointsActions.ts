
import { toast } from '@/hooks/use-toast';
import { User } from '../../types';
import { UserService } from '../../services/userService';
import { PointsDebugger } from '@/utils/pointsDebugger';

export const usePointsActions = (
  user: User | null,
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  refreshUser: () => Promise<void>,
  updateUserData: (userData: Partial<User>) => Promise<void>
) => {
  const updateUserPoints = async (points: number): Promise<void> => {
    if (!user) {
      console.log("updateUserPoints: No user found, skipping points update");
      return;
    }
    
    PointsDebugger.logPointsUpdateFlow('UPDATE_USER_POINTS_START', {
      userId: user.id,
      currentPoints: user.points,
      pointsToAdd: points
    });
    
    try {
      console.log(`updateUserPoints: Adding ${points} to current ${user.points} for user ${user.id}`);
      
      // Check database state before update
      await PointsDebugger.checkUserPointsInDatabase(user.id);
      
      // Update user points in the database using UserService
      const updatedUser = await UserService.updateUserPoints(user, points);
      console.log("updateUserPoints: Points updated in database successfully", updatedUser.points);
      
      PointsDebugger.logPointsUpdateFlow('DB_UPDATE_SUCCESS', {
        oldPoints: user.points,
        newPoints: updatedUser.points,
        pointsAdded: points
      });
      
      // Update the user data in the auth context immediately
      await updateUserData({
        points: updatedUser.points,
        level: updatedUser.level,
        levelPoints: updatedUser.levelPoints,
        maxLevelPoints: updatedUser.maxLevelPoints
      });
      console.log("updateUserPoints: User data updated in context with new points");
      
      // Validate the update worked
      setTimeout(async () => {
        await PointsDebugger.validatePointsConsistency(user.id, updatedUser.points);
      }, 1000);
      
      PointsDebugger.logPointsUpdateFlow('UPDATE_USER_POINTS_COMPLETE', {
        finalPoints: updatedUser.points
      });
      
    } catch (error: any) {
      console.error("updateUserPoints: Error updating points:", error);
      PointsDebugger.logPointsUpdateFlow('UPDATE_USER_POINTS_ERROR', error);
      setError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to update points. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateUserStreak = async (): Promise<void> => {
    if (!user) return;
    try {
      console.log("Updating user streak...");
      await UserService.updateUserStreak(user);
      await refreshUser();
      console.log("User streak updated successfully");
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to update streak. Please try again.",
        variant: "destructive",
      });
    }
  };

  const completeTask = async (): Promise<void> => {
    if (!user) return;
    setIsLoading(true);
    try {
      const taskUpdates = await UserService.completeTask(user);
      await updateUserData(taskUpdates);
      await refreshUser(); // Pull in the backend's current user data
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUserPoints,
    updateUserStreak,
    completeTask
  };
};
