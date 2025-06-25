import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

type Points = Database['public']['Tables']['user_profiles']['Row']['points'];

export class PointsUpdater {
  static async addPoints(userId: string, pointsToAdd: number): Promise<{ newPoints: Points | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('points')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user points:", error);
        return { newPoints: null, error };
      }

      const currentPoints = data?.points || 0;
      const newPoints = currentPoints + pointsToAdd;

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ points: newPoints })
        .eq('id', userId);

      if (updateError) {
        console.error("Error updating user points:", updateError);
        return { newPoints: null, error: updateError };
      }

      return { newPoints: newPoints, error: null };
    } catch (error: any) {
      console.error("Unexpected error adding points:", error);
      return { newPoints: null, error };
    }
  }

  static async subtractPoints(userId: string, pointsToRemove: number): Promise<{ newPoints: Points | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('points')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user points:", error);
        return { newPoints: null, error };
      }

      const currentPoints = data?.points || 0;
      const newPoints = Math.max(0, currentPoints - pointsToRemove); // Prevent negative points

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ points: newPoints })
        .eq('id', userId);

      if (updateError) {
        console.error("Error updating user points:", updateError);
        return { newPoints: null, error: updateError };
      }

      return { newPoints: newPoints, error: null };
    } catch (error: any) {
      console.error("Unexpected error subtracting points:", error);
      return { newPoints: null, error };
    }
  }
}
