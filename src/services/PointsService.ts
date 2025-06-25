
import { User } from "@/contexts/auth/types";
import { UserService } from "./UserService";

export class PointsService {
  static async updatePoints(user: User, pointsToAdd: number): Promise<User> {
    if (!user || pointsToAdd < 0) {
      throw new Error("Invalid user or points value");
    }

    const newPoints = user.points + pointsToAdd;
    const newLevelPoints = user.levelPoints + pointsToAdd;
    
    // Calculate level progression
    let newLevel = user.level;
    let currentLevelPoints = newLevelPoints;
    let maxLevelPoints = user.maxLevelPoints;
    
    // Level up logic - each level requires more points
    while (currentLevelPoints >= maxLevelPoints) {
      currentLevelPoints -= maxLevelPoints;
      newLevel++;
      maxLevelPoints = Math.floor(maxLevelPoints * 1.2); // 20% more points needed for next level
    }

    const updatedUser: User = {
      ...user,
      points: newPoints,
      level: newLevel,
      levelPoints: currentLevelPoints,
      maxLevelPoints: maxLevelPoints,
      weeklyActivity: typeof user.weeklyActivity === 'number' ? user.weeklyActivity : 0,
      lastActivityDate: new Date()
    };

    // Update in database with snake_case field names
    try {
      await UserService.updateProfile(user.id, {
        points: newPoints,
        level: newLevel,
        level_points: currentLevelPoints,
        max_level_points: maxLevelPoints,
        weekly_activity: typeof user.weeklyActivity === 'number' ? user.weeklyActivity : 0,
        last_activity_date: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to update user points in database:", error);
      throw error;
    }

    return updatedUser;
  }

  static calculateLevelProgress(levelPoints: number, maxLevelPoints: number): number {
    if (maxLevelPoints <= 0) return 0;
    return Math.min(100, (levelPoints / maxLevelPoints) * 100);
  }

  static getPointsNeededForNextLevel(levelPoints: number, maxLevelPoints: number): number {
    return Math.max(0, maxLevelPoints - levelPoints);
  }

  static async addPointsForTask(user: User, taskType: string): Promise<User> {
    const pointValues = {
      'post': 50,
      'idea': 10,
      'engage': 15,
      'learn': 20,
      'network': 25,
      'analyze': 30,
      'default': 10
    };

    const points = pointValues[taskType as keyof typeof pointValues] || pointValues.default;
    return this.updatePoints(user, points);
  }

  static async updateWeeklyActivity(user: User, activityPoints: number): Promise<User> {
    const currentWeeklyActivity = typeof user.weeklyActivity === 'number' ? user.weeklyActivity : 0;
    const newWeeklyActivity = currentWeeklyActivity + activityPoints;
    
    const updatedUser: User = {
      ...user,
      weeklyActivity: newWeeklyActivity
    };

    try {
      await UserService.updateProfile(user.id, {
        weekly_activity: newWeeklyActivity
      });
    } catch (error) {
      console.error("Failed to update weekly activity:", error);
      throw error;
    }

    return updatedUser;
  }

  static getNextLevelRequirement(level: number): number {
    const basePoints = 100;
    return Math.floor(basePoints * Math.pow(1.2, level - 1));
  }

  static calculateTotalPointsForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += this.getNextLevelRequirement(i);
    }
    return total;
  }

  static async resetWeeklyActivity(user: User): Promise<User> {
    const updatedUser: User = {
      ...user,
      weeklyActivity: 0
    };

    try {
      await UserService.updateProfile(user.id, {
        weekly_activity: 0
      });
    } catch (error) {
      console.error("Failed to reset weekly activity:", error);
      throw error;
    }

    return updatedUser;
  }
}
