
export interface StreakAchievement {
  id: string;
  name: string;
  description: string;
  daysRequired: number;
  points: number;
  icon: string;
  type: 'consecutive' | 'total' | 'first'; // Added type to distinguish achievement types
}

// Define all available streak achievements
export const streakAchievements: StreakAchievement[] = [
  {
    id: 'first-task',
    name: 'First Step',
    description: 'Complete your first task',
    daysRequired: 1,
    points: 10,
    icon: '🚀',
    type: 'first'
  },
  {
    id: 'three-day',
    name: '3-Day Streak',
    description: 'Complete tasks for 3 days in a row',
    daysRequired: 3,
    points: 20,
    icon: '🔥',
    type: 'consecutive'
  },
  {
    id: 'one-week',
    name: '7-Day Streak',
    description: 'Complete tasks for 7 days in a row',
    daysRequired: 7,
    points: 50,
    icon: '⭐',
    type: 'consecutive'
  },
  {
    id: 'two-week',
    name: '2-Week Titan',
    description: 'Complete tasks for 14 days in a row',
    daysRequired: 14,
    points: 75,
    icon: '🌟',
    type: 'consecutive'
  },
  {
    id: 'total-fifteen',
    name: '15-Day Milestone',
    description: 'Complete tasks on 15 different days (non-consecutive)',
    daysRequired: 15,
    points: 60,
    icon: '📅',
    type: 'total'
  },
  {
    id: 'three-week',
    name: '3-Week Trailblazer',
    description: 'Complete tasks for 21 days in a row',
    daysRequired: 21,
    points: 100,
    icon: '✨',
    type: 'consecutive'
  },
  {
    id: 'thirty-day',
    name: '30-Day Champion',
    description: 'Complete tasks for 30 days in a row',
    daysRequired: 30,
    points: 150,
    icon: '🏆',
    type: 'consecutive'
  }
];

// Check if user has achieved any new streak achievements
export const checkStreakAchievements = (
  currentStreak: number, 
  totalTaskDays: number,
  isFirstTask: boolean,
  unlockedAchievements: string[]
): StreakAchievement | null => {
  // Check for first-task achievement
  if (isFirstTask && !unlockedAchievements.includes('first-task')) {
    return streakAchievements.find(a => a.id === 'first-task') || null;
  }
  
  // Check consecutive streak achievements
  const streakAchievement = streakAchievements.find(
    achievement => 
      achievement.type === 'consecutive' &&
      achievement.daysRequired === currentStreak && 
      !unlockedAchievements.includes(achievement.id)
  );
  
  if (streakAchievement) {
    return streakAchievement;
  }
  
  // Check total days achievements
  const totalDaysAchievement = streakAchievements.find(
    achievement => 
      achievement.type === 'total' &&
      achievement.daysRequired === totalTaskDays &&
      !unlockedAchievements.includes(achievement.id)
  );
  
  return totalDaysAchievement || null;
};
