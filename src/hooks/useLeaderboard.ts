import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all-time';

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  points: number;
  current_streak: number;
  rank: number;
  rank_change: number;
}

export interface UserRank {
  rank: number;
  points: number;
  total_users: number;
}

export const useLeaderboard = (period: LeaderboardPeriod = 'all-time') => {
  const { user } = useAuth();
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, update the leaderboard stats
      await supabase.rpc('update_user_leaderboard_stats');

      // Determine which points column to use
      const pointsColumn = period === 'weekly' ? 'weekly_points' :
                          period === 'monthly' ? 'monthly_points' : 'all_time_points';

      // Fetch top 3 users with profile information including username
      const { data: topUsersData, error: topUsersError } = await supabase
        .from('user_leaderboard_stats')
        .select(`
          user_id,
          ${pointsColumn},
          current_streak,
          rank_change,
          user_profiles!inner (
            name,
            username,
            avatar_url
          )
        `)
        .order(pointsColumn, { ascending: false })
        .limit(3);

      if (topUsersError) throw topUsersError;

      // Transform the data
      const transformedTopUsers: LeaderboardUser[] = (topUsersData || []).map((item, index) => ({
        id: item.user_id,
        name: item.user_profiles?.name || 'Anonymous',
        username: item.user_profiles?.username,
        avatar_url: item.user_profiles?.avatar_url,
        points: item[pointsColumn as keyof typeof item] as number,
        current_streak: item.current_streak,
        rank: index + 1,
        rank_change: item.rank_change
      }));

      setTopUsers(transformedTopUsers);

      // If user is logged in, get their rank
      if (user?.id) {
        // Get user's current stats
        const { data: userStats, error: userStatsError } = await supabase
          .from('user_leaderboard_stats')
          .select(pointsColumn)
          .eq('user_id', user.id)
          .single();

        if (userStatsError && userStatsError.code !== 'PGRST116') {
          console.error('Error fetching user stats:', userStatsError);
        }

        if (userStats) {
          const userPoints = userStats[pointsColumn as keyof typeof userStats] as number;

          // Count how many users have more points
          const { count: higherRankedCount, error: countError } = await supabase
            .from('user_leaderboard_stats')
            .select('*', { count: 'exact', head: true })
            .gt(pointsColumn, userPoints);

          if (countError) throw countError;

          // Get total user count
          const { count: totalCount, error: totalCountError } = await supabase
            .from('user_leaderboard_stats')
            .select('*', { count: 'exact', head: true });

          if (totalCountError) throw totalCountError;

          setUserRank({
            rank: (higherRankedCount || 0) + 1,
            points: userPoints,
            total_users: totalCount || 0
          });
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [period, user?.id]);

  return {
    topUsers,
    userRank,
    isLoading,
    error,
    refetch: fetchLeaderboard
  };
};
