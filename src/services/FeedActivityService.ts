
import { supabase } from '@/integrations/supabase/client';

export class FeedActivityService {
  static async createWinActivity(userId: string, winTitle: string, platform: string) {
    try {
      console.log('Creating win feed activity:', { userId, winTitle, platform });
      const { data, error } = await supabase
        .from('creator_feed_activities')
        .insert({
          user_id: userId,
          activity_type: 'win',
          title: `Logged a win: ${winTitle}`,
          description: `Achieved success on ${platform}`,
          data: { platform, win_title: winTitle },
          is_public: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating win activity:', error);
        throw error;
      }
      
      console.log('Win feed activity created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating win activity:', error);
    }
  }

  static async createTaskActivity(userId: string, taskName: string, taskType: string, points: number) {
    try {
      console.log('Creating task feed activity:', { userId, taskName, taskType, points });
      const { data, error } = await supabase
        .from('creator_feed_activities')
        .insert({
          user_id: userId,
          activity_type: 'task_completion',
          title: `Completed ${taskName}`,
          description: `Earned ${points} points from ${taskType}`,
          data: { task_name: taskName, task_type: taskType, points_earned: points },
          is_public: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating task activity:', error);
        throw error;
      }
      
      console.log('Task completion feed activity created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating task activity:', error);
    }
  }

  static async createContentProgressActivity(userId: string, points: number) {
    try {
      console.log('Creating content progress feed activity:', { userId, points });
      const { data, error } = await supabase
        .from('creator_feed_activities')
        .insert({
          user_id: userId,
          activity_type: 'content_progress',
          title: `Completed content creation workflow!`,
          description: `Earned ${points} points for completing all content steps`,
          data: { points_earned: points },
          is_public: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating content progress activity:', error);
        throw error;
      }
      
      console.log('Content progress feed activity created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating content progress activity:', error);
    }
  }

  static async createMilestoneActivity(userId: string, points: number) {
    try {
      console.log('Creating milestone feed activity:', { userId, points });
      const { data, error } = await supabase
        .from('creator_feed_activities')
        .insert({
          user_id: userId,
          activity_type: 'milestone',
          title: `Hit ${points} points!`,
          description: 'Reached a new milestone',
          data: { points },
          is_public: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating milestone activity:', error);
        throw error;
      }
      
      console.log('Milestone feed activity created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating milestone activity:', error);
    }
  }

  static async createStreakActivity(userId: string, streakCount: number) {
    try {
      console.log('Creating streak feed activity:', { userId, streakCount });
      const { data, error } = await supabase
        .from('creator_feed_activities')
        .insert({
          user_id: userId,
          activity_type: 'streak',
          title: `Posted today — ${streakCount} day streak continues!`,
          description: 'Maintaining consistency',
          data: { streak_count: streakCount },
          is_public: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating streak activity:', error);
        throw error;
      }
      
      console.log('Streak feed activity created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating streak activity:', error);
    }
  }

  static async createBadgeActivity(userId: string, badgeName: string) {
    try {
      console.log('Creating badge feed activity:', { userId, badgeName });
      const { data, error } = await supabase
        .from('creator_feed_activities')
        .insert({
          user_id: userId,
          activity_type: 'badge_unlock',
          title: `Unlocked the ${badgeName}!`,
          description: 'Achieved a new badge',
          data: { badge_name: badgeName },
          is_public: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating badge activity:', error);
        throw error;
      }
      
      console.log('Badge unlock feed activity created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating badge activity:', error);
    }
  }

  static async createConnectionActivity(userAId: string, userBId: string, userAName: string, userBName: string) {
    try {
      console.log('Creating connection feed activity:', { userAId, userBId, userAName, userBName });
      const { data, error } = await supabase
        .from('creator_feed_activities')
        .insert({
          user_id: userAId,
          activity_type: 'connection',
          title: `${userAName} and ${userBName} are now connected`,
          description: 'New creators connected',
          data: { connected_user_id: userBId, connected_user_name: userBName },
          is_public: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating connection activity:', error);
        throw error;
      }
      
      console.log('Connection feed activity created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating connection activity:', error);
    }
  }
}
