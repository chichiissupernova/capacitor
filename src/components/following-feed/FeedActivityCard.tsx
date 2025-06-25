
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Trophy, Flame, Activity } from 'lucide-react';

interface FeedActivity {
  id: string;
  user_id: string;
  user_name: string;
  user_username: string;
  user_avatar: string;
  activity_type: 'task_completion' | 'streak_milestone' | 'level_up' | 'achievement';
  activity_data: any;
  created_at: string;
}

interface FeedActivityCardProps {
  activity: FeedActivity;
  onFormatTime: (dateString: string) => string;
}

export function FeedActivityCard({ activity, onFormatTime }: FeedActivityCardProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completion':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'streak_milestone':
        return <Flame className="h-4 w-4 text-orange-500" />;
      case 'level_up':
        return <Activity className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityMessage = (activity: FeedActivity) => {
    switch (activity.activity_type) {
      case 'task_completion':
        return `completed "${activity.activity_data.task_name}" and earned ${activity.activity_data.points_earned} points!`;
      case 'streak_milestone':
        return `reached a ${activity.activity_data.streak_days}-day streak!`;
      case 'level_up':
        return `leveled up to level ${activity.activity_data.new_level}!`;
      default:
        return 'had some activity';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activity.user_avatar} alt={activity.user_name} />
            <AvatarFallback>
              {activity.user_name[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {getActivityIcon(activity.activity_type)}
              <span className="font-semibold text-sm">{activity.user_name}</span>
              {activity.user_username && (
                <span className="text-xs text-gray-500">@{activity.user_username}</span>
              )}
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">
                {onFormatTime(activity.created_at)}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 mb-2">
              {getActivityMessage(activity)}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <Heart className="h-3 w-3" />
                <span>Like</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
