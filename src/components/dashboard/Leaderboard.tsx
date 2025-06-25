import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { useLeaderboard, LeaderboardPeriod } from '@/hooks/useLeaderboard';
import { useAuth } from '@/contexts/auth';
import { LeaderboardPeriodSelector } from './leaderboard/LeaderboardPeriodSelector';
import { LeaderboardContent } from './leaderboard/LeaderboardContent';

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('all-time');
  const { topUsers, userRank, isLoading, error, refetch } = useLeaderboard(selectedPeriod);

  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-chichi-purple" />
            Leaderboard
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refetch}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Creators who show up consistently rise to the top. Are you next?
        </p>
        
        <LeaderboardPeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </CardHeader>
      
      <CardContent>
        <LeaderboardContent
          topUsers={topUsers}
          userRank={userRank}
          user={user}
          isLoading={isLoading}
          error={error}
          onRefetch={refetch}
        />
      </CardContent>
    </Card>
  );
};
