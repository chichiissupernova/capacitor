
import { User } from '../types';
import { updateUserProfile, fetchUserProfile, mapSupabaseUserToUser } from '../utils';
import { supabase } from '@/integrations/supabase/client';

export class UserService {
  static async updateUserPoints(user: User, points: number): Promise<User> {
    console.log(`UserService.updateUserPoints: Current points: ${user.points}, Adding: ${points}`);
    
    const newPoints = user.points + points;
    const newLevel = Math.floor(newPoints / 100) + 1;
    const newLevelPoints = newPoints % 100;

    console.log(`UserService.updateUserPoints: New points: ${newPoints}, New level: ${newLevel}`);

    // Update the database first
    await updateUserProfile(user.id, { 
      points: newPoints,
      level: newLevel,
      level_points: newLevelPoints
    });

    console.log("UserService.updateUserPoints: Database updated successfully");

    // Return the updated user object
    const updatedUser = { 
      ...user, 
      points: newPoints,
      level: newLevel,
      levelPoints: newLevelPoints,
      maxLevelPoints: 100
    };

    console.log("UserService.updateUserPoints: Returning updated user with points:", updatedUser.points);
    return updatedUser;
  }

  static async updateUserData(user: User, userData: Partial<User>): Promise<User> {
    console.log("UserService.updateUserData: Updating user data:", userData);
    
    // Convert camelCase to snake_case for database fields
    const dbData: any = {};
    Object.keys(userData).forEach(key => {
      switch(key) {
        case 'levelPoints':
          dbData.level_points = userData[key];
          break;
        case 'maxLevelPoints':
          dbData.max_level_points = userData[key];
          break;
        case 'currentStreak':
          dbData.current_streak = userData[key];
          break;
        case 'longestStreak':
          dbData.longest_streak = userData[key];
          break;
        case 'lastActivityDate':
          dbData.last_activity_date = userData[key];
          break;
        case 'tasksCompleted':
          dbData.tasks_completed = userData[key];
          break;
        case 'totalTasks':
          dbData.total_tasks = userData[key];
          break;
        case 'weeklyActivity':
          dbData.weekly_activity = userData[key];
          break;
        case 'nichePreferences':
          dbData.niche_preferences = userData[key];
          break;
        case 'unlockedAchievements':
          dbData.unlocked_achievements = userData[key];
          break;
        case 'avatarUrl':
          dbData.avatar_url = userData[key];
          break;
        case 'instagramHandle':
          dbData.instagram_handle = userData[key];
          break;
        case 'tiktokHandle':
          dbData.tiktok_handle = userData[key];
          break;
        case 'twitterHandle':
          dbData.twitter_handle = userData[key];
          break;
        case 'pinterestHandle':
          dbData.pinterest_handle = userData[key];
          break;
        case 'youtubeHandle':
          dbData.youtube_handle = userData[key];
          break;
        default:
          dbData[key] = userData[key];
      }
    });
    
    await updateUserProfile(user.id, dbData);
    console.log("UserService.updateUserData: Database updated successfully");
    
    const updatedUser = { ...user, ...userData };
    console.log("UserService.updateUserData: Returning updated user");
    return updatedUser;
  }

  static async refreshUser(userId: string): Promise<User | null> {
    console.log("UserService.refreshUser: Refreshing user data for", userId);
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    
    if (!supabaseUser) {
      console.log("UserService.refreshUser: No authenticated user found");
      return null;
    }

    const userProfile = await fetchUserProfile(supabaseUser.id);
    
    if (userProfile) {
      const refreshedUser = mapSupabaseUserToUser(supabaseUser, userProfile);
      console.log("UserService.refreshUser: User refreshed with points:", refreshedUser.points);
      return refreshedUser;
    }
    
    console.log("UserService.refreshUser: No user profile found");
    return null;
  }

  static async updateUserStreak(user: User): Promise<void> {
    // Implementation for streak updates
    console.log('UserService.updateUserStreak: Updating streak for user:', user.id);
  }

  static async completeTask(user: User): Promise<Partial<User>> {
    const tasksCompleted = (user.tasksCompleted || 0) + 1;
    const totalTasks = (user.totalTasks || 0) + 1;
    
    await updateUserProfile(user.id, { 
      tasks_completed: tasksCompleted,
      total_tasks: totalTasks 
    });
    
    return {
      tasksCompleted,
      totalTasks
    };
  }
}
