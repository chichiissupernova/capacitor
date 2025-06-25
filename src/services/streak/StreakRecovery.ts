
import type { User } from "@/contexts/auth/types";
import { UserService } from "../UserService";
import { supabase } from '@/integrations/supabase/client';

export class StreakRecovery {
  // Maximum number of streak recovery attempts per month
  static MAX_RECOVERY_PER_MONTH = 3;

  /**
   * Check if a user has any recovery attempts remaining this month
   */
  static async canUserRecover(userId: string): Promise<boolean> {
    try {
      const count = await this.getRecoveryCount(userId);
      return count < this.MAX_RECOVERY_PER_MONTH;
    } catch (error) {
      console.error("Error checking recovery eligibility:", error);
      return false;
    }
  }
  
  /**
   * Get the number of streak recoveries a user has used this month
   */
  static async getRecoveryCount(userId: string): Promise<number> {
    try {
      if (!supabase) {
        return 0;
      }
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('action', 'streak_recovery')
        .gte('created_at', firstDayOfMonth.toISOString())
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching recovery count:", error);
        return 0;
      }
      
      return data ? data.length : 0;
    } catch (error) {
      console.error("Error in getRecoveryCount:", error);
      return 0;
    }
  }
  
  /**
   * Record a streak recovery usage in activity logs
   */
  static async recordRecoveryUsage(userId: string): Promise<void> {
    if (!supabase) return;
    
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: 'streak_recovery',
        details: { timestamp: new Date().toISOString() }
      });
      
    if (error) {
      console.error("Error recording recovery usage:", error);
      throw error;
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
    if (!user || !user.id) {
      return { 
        user, 
        success: false, 
        message: "User not found"
      };
    }
    
    try {
      // Check if the user can recover
      const canRecover = await this.canUserRecover(user.id);
      
      if (!canRecover) {
        return {
          user,
          success: false,
          message: "No recovery attempts remaining this month"
        };
      }
      
      // Get current recovery count and increment it
      const recoveryUsed = await this.getRecoveryCount(user.id);
      
      // Calculate previous streak (current + 1)
      const recoveredStreak = (user.currentStreak || 0) + 1;
      
      // Update user with the recovered streak
      const updatedUser = {
        ...user,
        currentStreak: recoveredStreak,
        longestStreak: Math.max(recoveredStreak, user.longestStreak || 0)
      };
      
      // Log the recovery
      try {
        await this.recordRecoveryUsage(user.id);
        
        // Update streak in database
        if (supabase) {
          const { error } = await supabase
            .from('user_profiles')
            .update({
              current_streak: updatedUser.currentStreak,
              longest_streak: updatedUser.longestStreak,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (error) {
            console.error("Error updating streak in Supabase:", error);
            return {
              user,
              success: false,
              message: "Failed to update streak"
            };
          }
        }
        
        // Log recovery activity
        UserService.logActivity(user.id, 'streak_recovery', {
          previous_streak: user.currentStreak,
          new_streak: recoveredStreak,
          recovery_count: recoveryUsed + 1
        });
        
        return {
          user: updatedUser,
          success: true,
          message: `Streak recovered! Your current streak is now ${recoveredStreak} days.`
        };
      } catch (error) {
        console.error("Error recovering streak:", error);
        return {
          user,
          success: false,
          message: "Failed to process streak recovery"
        };
      }
    } catch (error) {
      console.error("Error in recoverStreak:", error);
      return {
        user,
        success: false,
        message: "An unexpected error occurred"
      };
    }
  }
}
