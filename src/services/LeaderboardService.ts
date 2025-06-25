
import { supabase } from '@/integrations/supabase/client';

export class LeaderboardService {
  private static instance: LeaderboardService;
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  async updateLeaderboardStats(): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_user_leaderboard_stats');
      if (error) {
        console.error('Error updating leaderboard stats:', error);
      } else {
        console.log('Leaderboard stats updated successfully');
      }
    } catch (error) {
      console.error('Unexpected error updating leaderboard:', error);
    }
  }

  startAutoUpdate(intervalMinutes: number = 30): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Update immediately
    this.updateLeaderboardStats();
    
    // Then set up recurring updates
    this.updateInterval = setInterval(() => {
      this.updateLeaderboardStats();
    }, intervalMinutes * 60 * 1000);
  }

  stopAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  async calculateRankChange(userId: string, currentRank: number): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('user_leaderboard_stats')
        .select('rank_change, last_rank_update')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      // If last update was more than 24 hours ago, reset rank change
      const lastUpdate = new Date(data.last_rank_update);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff >= 24) {
        // Update with new rank change calculation would go here
        // For now, we'll just return 0 since we need previous rank data
        return 0;
      }

      return data.rank_change || 0;
    } catch (error) {
      console.error('Error calculating rank change:', error);
      return 0;
    }
  }
}

// Initialize the service
export const leaderboardService = LeaderboardService.getInstance();
