
import { supabase } from '@/integrations/supabase/client';

export class PointsDebugger {
  static async checkUserPointsInDatabase(userId: string) {
    console.log('🔍 POINTS DEBUGGER: Checking database for user:', userId);
    
    try {
      // Check user_profiles table
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('points, level, level_points, current_streak, longest_streak')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('❌ POINTS DEBUGGER: Error fetching user profile:', profileError);
        return null;
      }

      console.log('📊 POINTS DEBUGGER: Database user profile:', userProfile);

      // Check recent task completions
      const { data: recentTasks, error: tasksError } = await supabase
        .from('task_completions')
        .select('task_id, points_earned, completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (tasksError) {
        console.error('❌ POINTS DEBUGGER: Error fetching task completions:', tasksError);
      } else {
        console.log('📝 POINTS DEBUGGER: Recent task completions:', recentTasks);
      }

      // Check daily tasks
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyTasks, error: dailyError } = await supabase
        .from('daily_tasks')
        .select('task_id, points, completed')
        .eq('user_id', userId)
        .eq('task_date', today);

      if (dailyError) {
        console.error('❌ POINTS DEBUGGER: Error fetching daily tasks:', dailyError);
      } else {
        console.log('📅 POINTS DEBUGGER: Today\'s daily tasks:', dailyTasks);
      }

      return {
        userProfile,
        recentTasks,
        dailyTasks
      };
    } catch (error) {
      console.error('💥 POINTS DEBUGGER: Unexpected error:', error);
      return null;
    }
  }

  static logPointsUpdateFlow(step: string, data: any) {
    console.log(`🔄 POINTS FLOW [${step}]:`, data);
  }

  static async validatePointsConsistency(userId: string, expectedPoints: number) {
    const dbData = await this.checkUserPointsInDatabase(userId);
    if (dbData?.userProfile) {
      const actualPoints = dbData.userProfile.points;
      const difference = actualPoints - expectedPoints;
      
      console.log('🎯 POINTS VALIDATION:', {
        expected: expectedPoints,
        actual: actualPoints,
        difference,
        consistent: difference === 0
      });
      
      return difference === 0;
    }
    return false;
  }
}
