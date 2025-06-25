
import { checkStreakAchievements, type StreakAchievement } from '@/utils/streakAchievements';
import { AchievementService } from '../AchievementService';

export class StreakAchievementHandler {
  /**
   * Check and process achievements based on streak and activity data
   */
  static checkAchievements(
    currentStreak: number,
    totalTaskDays: number,
    isFirstTask: boolean,
    unlockedAchievements: string[]
  ): StreakAchievement | null {
    return checkStreakAchievements(
      currentStreak, 
      totalTaskDays, 
      isFirstTask,
      unlockedAchievements
    );
  }
}
