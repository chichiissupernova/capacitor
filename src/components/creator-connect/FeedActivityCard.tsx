
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { FeedActivity, FeedReaction } from '@/types/feed';

interface FeedActivityCardProps {
  activity: FeedActivity;
  reactions: FeedReaction[];
  userReactions: Set<string>;
  onReaction: (activityId: string, reactionType: 'big' | 'inspired' | 'goal') => void;
  onRemoveReaction: (activityId: string, reactionType: 'big' | 'inspired' | 'goal') => void;
}

const getActivityIcon = (type: FeedActivity['activity_type']) => {
  switch (type) {
    case 'win':
      return '🏆';
    case 'milestone':
      return '🎯';
    case 'streak':
      return '🔥';
    case 'badge_unlock':
      return '🏅';
    case 'connection':
      return '🤝';
    case 'task_completion':
      return '✅';
    case 'content_progress':
      return '🎬';
    default:
      return '✨';
  }
};

const getActivityColor = (type: FeedActivity['activity_type']) => {
  switch (type) {
    case 'win':
      return 'text-yellow-600';
    case 'milestone':
      return 'text-chichi-purple';
    case 'streak':
      return 'text-orange-500';
    case 'badge_unlock':
      return 'text-blue-600';
    case 'connection':
      return 'text-green-600';
    case 'task_completion':
      return 'text-emerald-600';
    case 'content_progress':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
};

const reactionEmojis = {
  big: '🔥',
  inspired: '💡',
  goal: '🎯'
};

const reactionLabels = {
  big: "That's Big",
  inspired: "Inspired Me",
  goal: "Goal Energy"
};

export function FeedActivityCard({ 
  activity, 
  reactions, 
  userReactions, 
  onReaction, 
  onRemoveReaction 
}: FeedActivityCardProps) {
  const displayName = activity.user_name || activity.username || 'Creator';
  const timeAgo = formatDistanceToNow(new Date(activity.created_at), { addSuffix: true });

  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleReactionClick = (reactionType: 'big' | 'inspired' | 'goal') => {
    if (userReactions.has(reactionType)) {
      onRemoveReaction(activity.id, reactionType);
    } else {
      onReaction(activity.id, reactionType);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 mb-3 transition-all duration-200 hover:shadow-sm">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-3">
        <Link to={`/u/${activity.username}`}>
          <Avatar className="h-10 w-10 hover:opacity-80 transition-opacity">
            <AvatarImage src={activity.avatar_url || ""} alt={displayName} />
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Link 
              to={`/u/${activity.username}`}
              className="font-medium text-sm text-gray-900 hover:text-chichi-purple transition-colors"
            >
              {displayName}
            </Link>
            <span className={`text-lg ${getActivityColor(activity.activity_type)}`}>
              {getActivityIcon(activity.activity_type)}
            </span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          
          {activity.niche_preferences && activity.niche_preferences.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {activity.niche_preferences.slice(0, 2).map((niche) => (
                <Badge key={niche} variant="secondary" className="text-xs px-2 py-0">
                  {niche}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-sm text-gray-900 mb-1">{activity.title}</p>
        {activity.description && (
          <p className="text-xs text-gray-600">{activity.description}</p>
        )}
      </div>

      {/* Reactions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {(['big', 'inspired', 'goal'] as const).map((reactionType) => {
            const count = reactionCounts[reactionType] || 0;
            const isActive = userReactions.has(reactionType);
            
            return (
              <Button
                key={reactionType}
                variant="ghost"
                size="sm"
                onClick={() => handleReactionClick(reactionType)}
                className={`h-7 px-2 text-xs transition-all duration-200 ${
                  isActive 
                    ? 'bg-chichi-purple-soft text-chichi-purple border border-chichi-purple/20' 
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className="mr-1">{reactionEmojis[reactionType]}</span>
                <span className="hidden sm:inline">{reactionLabels[reactionType]}</span>
                {count > 0 && (
                  <span className="ml-1 text-xs font-medium">
                    {count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
