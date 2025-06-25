
/**
 * Pure calculation logic for points and levels
 */
export class PointsCalculator {
  /**
   * Calculates the new level and points after adding points
   */
  static calculateLevelFromPoints(
    currentPoints: number,
    currentLevel: number,
    currentLevelPoints: number,
    maxLevelPoints: number,
    pointsToAdd: number
  ): { newTotalPoints: number; newLevel: number; newLevelPoints: number; levelsGained: number } {
    // Ensure all inputs are valid numbers
    const safeCurrentPoints = Math.max(0, isNaN(currentPoints) ? 0 : currentPoints);
    const safeLevelPoints = Math.max(0, isNaN(currentLevelPoints) ? 0 : currentLevelPoints);
    const safeMaxLevelPoints = Math.max(1, isNaN(maxLevelPoints) ? 100 : maxLevelPoints);
    const safeCurrentLevel = Math.max(1, Math.min(100, isNaN(currentLevel) ? 1 : currentLevel));
    const safePointsToAdd = Math.max(0, isNaN(pointsToAdd) ? 0 : pointsToAdd);
    
    // Calculate new totals
    const newTotalPoints = safeCurrentPoints + safePointsToAdd;
    const totalLevelPoints = safeLevelPoints + safePointsToAdd;
    const levelsGained = Math.floor(totalLevelPoints / safeMaxLevelPoints);
    const newLevel = Math.min(100, safeCurrentLevel + levelsGained); // Cap at level 100
    const newLevelPoints = totalLevelPoints % safeMaxLevelPoints;
    
    return {
      newTotalPoints,
      newLevel,
      newLevelPoints,
      levelsGained
    };
  }

  /**
   * Helper to generate optimistic UI updates
   */
  static getOptimisticUser(user: any, pointsToAdd: number): any {
    const optimisticTotalPoints = Math.max(0, (user.points || 0) + pointsToAdd);
    const optimisticLevelPoints = Math.max(0, (user.levelPoints || 0) + pointsToAdd);
    const maxLevelPoints = user.maxLevelPoints || 100;
    const levelsGained = Math.floor(optimisticLevelPoints / maxLevelPoints);
    
    return {
      ...user,
      points: optimisticTotalPoints,
      levelPoints: optimisticLevelPoints % maxLevelPoints,
      level: levelsGained > 0 ? Math.min(100, (user.level || 1) + levelsGained) : (user.level || 1),
      weeklyActivity: Math.min(100, Math.round(optimisticTotalPoints / 10))
    };
  }
}
