import { isYesterday, isSameDay, isWithinInterval, subDays } from 'date-fns';
import { UserService } from '../UserService';
import type { User } from "@/contexts/auth/types";
import { supabase } from '@/integrations/supabase/client';
import { StreakAchievementHandler } from './StreakAchievementHandler';
import { StreakRecovery } from './StreakRecovery';
import { type StreakAchievement } from '@/utils/streakAchievements';

export class StreakProcessor {
  // Maximum number of streak recovery attempts per month
  static MAX_RECOVERY_PER_MONTH = 3;
  
  // Grace period for streak recovery (in hours)
  static RECOVERY_GRACE_PERIOD_HOURS = 36;
  
  /**
   * Process the streak update using the provided timestamp
   */
  static async processStreakUpdate(user: User, currentDate: Date): Promise<{
    user: User;
    achievement: StreakAchievement | null;
    canRecover: boolean;
  }> {
    let lastActivity: Date;
    
    // Handle string or Date object for lastActivityDate
    if (typeof user.lastActivityDate === 'string') {
      lastActivity = new Date(user.lastActivityDate);
    } else if (user.lastActivityDate instanceof Date) {
      lastActivity = user.lastActivityDate;
    } else {
      // If lastActivityDate is invalid, use today as fallback
      console.warn("Invalid lastActivityDate, using today as fallback");
      lastActivity = new Date();
    }
    
    let newStreak = user.currentStreak || 0;
    let achievementUnlocked: StreakAchievement | null = null;
    let canRecover = false;
    
    // Determine if this is the first ever task completion
    const isFirstTask = user.tasksCompleted === 0;
    
    // Get total active days (days with completed tasks)
    const totalTaskDays = await this.countTotalTaskDays(user.id);
    console.log(`Total task days for user: ${totalTaskDays}`);
    
    if (!lastActivity || isNaN(lastActivity.getTime())) {
      // First activity or invalid date
      console.log("First activity detected or invalid last activity date");
      newStreak = 1;
    } else if (isSameDay(lastActivity, currentDate)) {
      // Already logged activity today, streak unchanged
      console.log("Already logged activity today, streak unchanged");
      
      // Still check for achievements based on total days if applicable
      if (totalTaskDays === 15 && !user.unlockedAchievements.includes('total-fifteen')) {
        achievementUnlocked = StreakAchievementHandler.checkAchievements(
          newStreak, 
          totalTaskDays, 
          isFirstTask,
          user.unlockedAchievements || []
        );
      }
      
      return { 
        user, 
        achievement: achievementUnlocked,
        canRecover: false
      };
    } else if (isYesterday(lastActivity)) {
      // Consecutive day
      console.log("Consecutive day detected");
      newStreak = (user.currentStreak || 0) + 1;
    } else {
      // Check if within recovery period
      const yesterday = subDays(currentDate, 1);
      const dayBeforeYesterday = subDays(currentDate, 2);
      
      if (isSameDay(lastActivity, dayBeforeYesterday)) {
        // Missed yesterday, eligible for recovery
        console.log("Streak broken but eligible for recovery - day before yesterday");
        canRecover = await StreakRecovery.canUserRecover(user.id);
        newStreak = 1; // Reset streak, will be restored on recovery
      } else {
        // Check if within grace period for recovery (36 hours from midnight)
        const missedDay = subDays(currentDate, 1);
        missedDay.setHours(0, 0, 0, 0);
        const gracePeriodEnd = new Date(missedDay);
        gracePeriodEnd.setHours(gracePeriodEnd.getHours() + this.RECOVERY_GRACE_PERIOD_HOURS);
        
        if (isWithinInterval(lastActivity, { start: missedDay, end: gracePeriodEnd })) {
          console.log("Within grace period for recovery");
          canRecover = await StreakRecovery.canUserRecover(user.id);
          newStreak = 1; // Reset streak, will be restored on recovery
        } else {
          // Streak broken
          console.log("Streak broken - reset to 1");
          newStreak = 1;
        }
      }
    }
    
    // Cap streak at a reasonable maximum (e.g., 365 days)
    if (newStreak > 365) {
      console.warn(`Capping unrealistic streak value: ${newStreak} -> 365`);
      newStreak = 365;
    }
    
    const updatedUser = { 
      ...user, 
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak || 0),
      lastActivityDate: currentDate
    };
    
    console.log("Updated user streak:", {
      newStreak,
      longestStreak: updatedUser.longestStreak
    });
    
    // Update Supabase
    try {
      if (supabase) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            current_streak: updatedUser.currentStreak,
            longest_streak: updatedUser.longestStreak,
            last_activity_date: updatedUser.lastActivityDate.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (error) {
          console.error("Error updating streak in Supabase:", error);
        }
      }
    } catch (e) {
      console.log("Supabase not available, skipping remote update");
    }
    
    // Log streak update to activity logs
    try {
      UserService.logActivity(user.id, 'streak_update', {
        current_streak: newStreak,
        longest_streak: updatedUser.longestStreak
      });
    } catch (e) {
      console.error("Error logging activity:", e);
    }
    
    // Check for achievements (consecutive streak, total days, or first task)
    achievementUnlocked = StreakAchievementHandler.checkAchievements(
      newStreak, 
      totalTaskDays, 
      isFirstTask,
      user.unlockedAchievements || []
    );
    
    console.log("Streak updated successfully");
    
    return { 
      user: updatedUser, 
      achievement: achievementUnlocked,
      canRecover
    };
  }
  
  /**
   * Count the total number of days a user has completed tasks
   */
  static async countTotalTaskDays(userId: string): Promise<number> {
    try {
      if (!supabase) {
        console.log("Supabase not available, using default value");
        return 0;
      }
      
      // Get all task completions for the user
      const { data, error } = await supabase
        .from('task_completions')
        .select('completed_at')
        .eq('user_id', userId);
        
      if (error) {
        console.error("Error fetching task completions:", error);
        return 0;
      }
      
      if (!data || data.length === 0) {
        return 0;
      }
      
      // Convert to dates and filter out invalid dates
      const completionDates = data
        .map(item => new Date(item.completed_at))
        .filter(date => !isNaN(date.getTime()));
      
      // Get unique dates (by converting to date string YYYY-MM-DD)
      const uniqueDates = new Set(
        completionDates.map(date => 
          new Date(date).toISOString().split('T')[0]
        )
      );
      
      return uniqueDates.size;
    } catch (e) {
      console.error("Error counting task days:", e);
      return 0;
    }
  }
}
