
import { supabase } from "@/integrations/supabase/client";

export class NotificationService {
  static async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data: Record<string, any> = {}
  ) {
    try {
      const { error } = await supabase.rpc('create_notification', {
        target_user_id: userId,
        notification_type: type,
        notification_title: title,
        notification_message: message,
        notification_data: data
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  static async createMilestoneNotification(userId: string, milestone: string, points: number) {
    await this.createNotification(
      userId,
      'milestone_unlocked',
      'Milestone Unlocked!',
      `👏 You hit ${points} points! ${milestone}`,
      { milestone, points }
    );
  }

  static async createWinReactionNotification(
    userId: string,
    reactorName: string,
    reaction: string,
    winTitle: string
  ) {
    await this.createNotification(
      userId,
      'win_reaction',
      'New Reaction to Your Win',
      `${reaction} ${reactorName} reacted to your win: "${winTitle}"`,
      { reactor_name: reactorName, reaction, win_title: winTitle }
    );
  }

  static async createSystemUpdateNotification(title: string, message: string) {
    // This would typically be called from an admin interface or scheduled job
    // For now, it's just a placeholder for the service structure
    console.log('System notification would be sent:', { title, message });
  }

  static async createConnectionRequest(requesterId: string, requestedId: string) {
    try {
      const { error } = await supabase
        .from('connection_requests')
        .insert({
          requester_id: requesterId,
          requested_id: requestedId,
          status: 'pending'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating connection request:', error);
      throw error;
    }
  }
}
