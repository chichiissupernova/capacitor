import React, { useState, useEffect } from 'react';
import { Check, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { RewardAnimation } from '@/components/animations/RewardAnimation';
import { useAuth } from '@/contexts/auth';

export interface ContentTaskProps {
  id: string;
  title: string;
  description?: string;
  date: Date;
  platform: string;
  contentType: string;
  points: number;
  completed: boolean;
  onComplete: (id: string) => void;
  onClick?: () => void;
  className?: string;
}

export const ContentTask: React.FC<ContentTaskProps> = ({
  id,
  title,
  description,
  date,
  platform,
  contentType,
  points,
  completed,
  onComplete,
  onClick,
  className
}) => {
  const [showReward, setShowReward] = useState(false);
  // Track locally completed state
  const [isCompleted, setIsCompleted] = useState(completed);
  const { completeTask } = useAuth();
  
  // Auto-hide reward after it's shown
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (showReward) {
      timeoutId = window.setTimeout(() => {
        setShowReward(false);
      }, 3000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showReward]);
  
  const handleComplete = () => {
    // Set local completed state first for immediate UI feedback
    setIsCompleted(true);
    onComplete(id);
    completeTask();
    setShowReward(true);
    
    // Regular toast is replaced by the animation
    // but we'll keep it for accessibility purposes with a delay and auto-dismiss
    setTimeout(() => {
      const { dismiss } = toast({
        title: "Task completed! 🎉",
        description: `You earned ${points} points for your ${contentType}!`,
      });
      
      // Auto-dismiss the toast after 5 seconds
      setTimeout(() => {
        dismiss();
      }, 5000);
    }, 2000);
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const getPlatformColor = (platform: string) => {
    const platforms: Record<string, string> = {
      instagram: "bg-gradient-to-r from-pink-500 to-purple-500",
      tiktok: "bg-black",
      youtube: "bg-red-600",
      twitter: "bg-blue-400",
      linkedin: "bg-blue-700",
      facebook: "bg-blue-600",
      default: "bg-gray-500"
    };
    return platforms[platform.toLowerCase()] || platforms.default;
  };

  const getContentTypeEmoji = (type: string) => {
    const types: Record<string, string> = {
      post: "📱",
      reel: "🎬",
      story: "📸",
      video: "🎥",
      article: "📝",
      tweet: "💬",
      default: "📄"
    };
    return types[type.toLowerCase()] || types.default;
  };

  return (
    <div 
      className={cn(
        "content-card relative",
        isCompleted ? "border-green-200 bg-green-50" : "",
        className
      )}
      onClick={onClick}
    >
      {/* Platform badge */}
      <div className={cn(
        "absolute top-0 right-0 px-3 py-1 text-xs font-medium text-white rounded-bl-lg rounded-tr-xl",
        getPlatformColor(platform)
      )}>
        {platform}
      </div>
      
      {/* Task content */}
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <h3 className="font-semibold text-lg flex items-center">
            <span className="mr-2">{getContentTypeEmoji(contentType)}</span>
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium text-chichi-orange">{points} points</span>
            </div>
            {!isCompleted ? (
              <Button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  handleComplete();
                }} 
                size="sm" 
                className="bg-chichi-orange hover:bg-chichi-orange/90"
              >
                Mark Complete
              </Button>
            ) : (
              <div className="flex items-center text-green-600 text-sm">
                <Check className="h-4 w-4 mr-1" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showReward && (
        <RewardAnimation 
          points={points}
          onComplete={() => setShowReward(false)}
        />
      )}
    </div>
  );
};
