
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

interface UserStatsCardProps {
  followingCount: number;
}

export function UserStatsCard({ followingCount }: UserStatsCardProps) {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Following</span>
          <span className="font-semibold">{followingCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Your Streak</span>
          <span className="font-semibold flex items-center gap-1">
            <Flame className="h-3 w-3 text-orange-500" />
            {user?.currentStreak || 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Your Level</span>
          <span className="font-semibold">{user?.level || 1}</span>
        </div>
      </CardContent>
    </Card>
  );
}
