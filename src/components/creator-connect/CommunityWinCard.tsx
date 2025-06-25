
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Instagram, Music, Youtube, Globe } from 'lucide-react';
import { CommunityWin } from '@/hooks/useWins';
import { Link } from 'react-router-dom';

interface CommunityWinCardProps {
  win: CommunityWin;
  onReaction: (winId: string, reactionType: 'big' | 'inspired' | 'goal') => void;
}

const platformIcons = {
  Instagram: Instagram,
  TikTok: Music,
  YouTube: Youtube,
  Other: Globe,
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

export function CommunityWinCard({ win, onReaction }: CommunityWinCardProps) {
  const PlatformIcon = platformIcons[win.platform as keyof typeof platformIcons] || Globe;
  
  const handleReaction = async (reactionType: 'big' | 'inspired' | 'goal') => {
    await onReaction(win.id, reactionType);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 transition-all duration-200 hover:shadow-sm">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <Link to={`/u/${win.username}`}>
          <Avatar className="h-10 w-10 hover:opacity-80 transition-opacity">
            <AvatarImage src={win.avatar_url || undefined} />
            <AvatarFallback className="bg-chichi-purple text-white text-sm">
              {(win.user_name || win.username || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Link 
              to={`/u/${win.username}`}
              className="font-medium text-sm text-gray-900 hover:text-chichi-purple transition-colors"
            >
              {win.user_name || win.username}
            </Link>
            <span className="text-lg">🏆</span>
            <span className="text-xs text-gray-500">
              {new Date(win.created_at).toLocaleDateString()}
            </span>
          </div>
          
          {win.username && win.user_name && (
            <p className="text-xs text-gray-500">@{win.username}</p>
          )}
        </div>
      </div>

      {/* Win Content */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm mb-2">{win.title}</h4>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(win.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <PlatformIcon className="h-3 w-3" />
            {win.platform}
          </div>
        </div>
      </div>

      {/* Tags */}
      {win.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {win.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Screenshot */}
      {win.screenshot_url && (
        <div className="mb-3">
          <img 
            src={win.screenshot_url} 
            alt="Win screenshot" 
            className="w-full max-h-48 object-cover rounded-md"
          />
        </div>
      )}

      {/* Description */}
      {win.description && (
        <p className="text-sm text-gray-600 mb-3">{win.description}</p>
      )}

      {/* Reactions */}
      <div className="flex items-center space-x-2 pt-2 border-t">
        {Object.entries(reactionEmojis).map(([type, emoji]) => {
          const count = win[`${type}_reactions` as keyof CommunityWin] as number;
          return (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(type as 'big' | 'inspired' | 'goal')}
              className="h-7 px-2 text-xs transition-all duration-200 hover:bg-gray-50 text-gray-600"
            >
              <span className="mr-1">{emoji}</span>
              <span className="hidden sm:inline">{reactionLabels[type as keyof typeof reactionLabels]}</span>
              {count > 0 && <span className="ml-1">({count})</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
