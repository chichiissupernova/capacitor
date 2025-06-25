
import { format, isYesterday, isSameDay, addDays, subDays, isWithinInterval, parseISO } from 'date-fns';
import { UserService } from './UserService';
import type { User } from "@/contexts/auth/types";
import { checkStreakAchievements, type StreakAchievement } from '@/utils/streakAchievements';
import { AchievementService } from './AchievementService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { StreakRecovery } from './streak/StreakRecovery';
import { StreakProcessor } from './streak/StreakProcessor';
import { StreakAchievementHandler } from './streak/StreakAchievementHandler';

/**
 * Service for handling user streaks
 */
export class StreakService {
  // Track when a streak was last updated to prevent duplicate updates
  private static lastUpdateTime: Record<string, number> = {};
  
  /**
   * Updates a user's streak based on their last activity date
   */
  static async updateStreak(user: User, forceUpdate: boolean = false): Promise<{
    user: User;
    achievement: StreakAchievement | null;
    canRecover: boolean;
  }> {
    if (!user || !user.id) {
      console.error("Cannot update streak: User or user ID is missing");
      return { user, achievement: null, canRecover: false };
    }
    
    // Implement debouncing to prevent multiple streak updates in quick succession
    const now = Date.now();
    const lastUpdate = this.lastUpdateTime[user.id] || 0;
    const timeSinceLastUpdate = now - lastUpdate;
    
    // Only allow one streak update per user every 30 seconds, unless forced
    if (!forceUpdate && timeSinceLastUpdate < 30000) {
      console.log(`Skipping streak update - last updated ${timeSinceLastUpdate}ms ago`);
      return { user, achievement: null, canRecover: false };
    }
    
    console.log(`Updating streak for user ${user.id} ${forceUpdate ? '(FORCED)' : ''}`);
    this.lastUpdateTime[user.id] = now;
    
    try {
      // Get the server's current timestamp from Supabase
      const { data: timeData, error: timeError } = await supabase.functions.invoke('get_server_timestamp');
      
      if (timeError) {
        console.error("Error fetching server timestamp:", timeError);
        // Fallback to client time if server time fetch fails
        return await StreakProcessor.processStreakUpdate(user, new Date());
      }
      
      // Use the server timestamp
      const serverTime = new Date(timeData.timestamp);
      console.log("Using server timestamp:", serverTime);
      
      return await StreakProcessor.processStreakUpdate(user, serverTime);
    } catch (error) {
      console.error("Error in updateStreak:", error);
      // Fallback to client time if there's an error
      return await StreakProcessor.processStreakUpdate(user, new Date());
    }
  }
  
  /**
   * Recover a broken streak for a user
   */
  static async recoverStreak(user: User): Promise<{
    user: User;
    success: boolean;
    message: string;
  }> {
    return await StreakRecovery.recoverStreak(user);
  }
  
  /**
   * Force update streak immediately (bypasses debouncing)
   */
  static async forceUpdateStreak(user: User): Promise<{
    user: User;
    achievement: StreakAchievement | null;
    canRecover: boolean;
  }> {
    return this.updateStreak(user, true);
  }
}
