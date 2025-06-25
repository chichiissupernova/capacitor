
import { UserService } from './UserService';
import { PointsService } from './PointsService';
import type { User } from "@/contexts/auth/types";
import type { StreakAchievement } from '@/utils/streakAchievements';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

export class AchievementService {
  /**
   * Unlocks an achievement for a user and awards points
   */
  static async unlockAchievement(
    user: User, 
    achievement: StreakAchievement
  ): Promise<User> {
    console.log(`Unlocking achievement ${achievement.id} for user ${user.id}`);
    
    if (user.unlockedAchievements.includes(achievement.id)) {
      console.warn(`Achievement ${achievement.id} already unlocked`);
      return user;
    }
    
    // Add achievement to the user's unlocked achievements
    const updatedAchievements = [...user.unlockedAchievements, achievement.id];
    
    // Update in Supabase
    const { error } = await supabase
      .from('user_profiles')
      .update({
        unlocked_achievements: updatedAchievements,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
      
    if (error) {
      console.error("Error updating achievements in Supabase:", error);
      throw new Error("Failed to unlock achievement");
    }
    
    // Log achievement unlock
    await UserService.logActivity(user.id, 'achievement_unlocked', {
      achievement_id: achievement.id,
      achievement_name: achievement.name,
      achievement_type: achievement.type,
      points_earned: achievement.points
    });
    
    // Update user with achievement and update points
    const userWithAchievement = {
      ...user,
      unlockedAchievements: updatedAchievements
    };
    
    console.log("Achievement unlocked successfully");
    
    // Award points for the achievement
    const updatedUser = await PointsService.updatePoints(
      userWithAchievement,
      achievement.points
    );
    
    // Show achievement toast notification
    toast({
      title: `Achievement Unlocked: ${achievement.name}`,
      description: `${achievement.description} +${achievement.points} points!`,
      variant: "default",
      duration: 5000
    });
    
    return updatedUser;
  }
  
  /**
   * Check for and handle any achievement unlocks when tasks are completed
   */
  static async checkAndUnlockAchievements(user: User): Promise<User | null> {
    if (!user) return null;
    
    try {
      // Update streak first which checks for streak-based achievements
      const { user: updatedUser, achievement } = await import('@/services/StreakService')
        .then(module => module.StreakService.updateStreak(user));
      
      if (achievement) {
        // Unlock the achievement and return the updated user
        return await AchievementService.unlockAchievement(updatedUser, achievement);
      }
      
      return updatedUser;
    } catch (error) {
      console.error("Error checking achievements:", error);
      return user;
    }
  }
}
