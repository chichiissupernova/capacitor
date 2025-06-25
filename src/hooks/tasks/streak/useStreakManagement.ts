
import { StreakService } from '@/services/StreakService';
import { FeedActivityService } from '@/services/FeedActivityService';
import { User } from '@/contexts/auth/types';

export const useStreakManagement = () => {
  const handleStreakUpdate = async (
    taskId: string,
    user: User,
    pointsAwarded: number,
    updateUserData?: (data: Partial<User>) => Promise<void>
  ): Promise<{ user: User; achievement: any; canRecover: boolean } | null> => {
    // CRITICAL: Only update streak for the main "post" task
    if (taskId === 'post') {
      try {
        const streakResult = await StreakService.forceUpdateStreak(user);
        
        // Create streak activity for feed
        try {
          await FeedActivityService.createStreakActivity(user.id, streakResult.user.currentStreak || 1);
        } catch (streakFeedError) {
          console.error("Failed to create streak feed activity (non-critical):", streakFeedError);
        }
        
        return streakResult;
      } catch (streakError) {
        console.error("Failed to update streak (non-critical):", streakError);
        return null;
      }
    }
    
    return null;
  };

  return {
    handleStreakUpdate
  };
};
