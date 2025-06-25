
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react';

export const ProfileStats: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      icon: Trophy,
      label: 'Total Points',
      value: user?.points || 0,
      color: 'text-chichi-orange'
    },
    {
      icon: Target,
      label: 'Current Streak',
      value: `${user?.currentStreak || 0} days`,
      color: 'text-green-600'
    },
    {
      icon: Calendar,
      label: 'Longest Streak',
      value: `${user?.longestStreak || 0} days`,
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Level',
      value: user?.level || 1,
      color: 'text-chichi-purple'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Level Progress</span>
            <Badge variant="outline">
              {user?.levelPoints || 0} / {user?.maxLevelPoints || 100} XP
            </Badge>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-chichi-orange h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((user?.levelPoints || 0) / (user?.maxLevelPoints || 100)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
