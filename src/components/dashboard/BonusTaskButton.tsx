
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, MessageCircle, Heart, Camera, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Task = {
  id: string;
  label: string;
  points: number;
  completed: boolean;
};

interface BonusTaskButtonProps {
  task: Task;
  isSubmitting: boolean;
  isUserLoggedIn: boolean;
  onComplete: (taskId: string) => void;
}

export const BonusTaskButton = ({ 
  task, 
  isSubmitting, 
  isUserLoggedIn, 
  onComplete
}: BonusTaskButtonProps) => {
  const { id, label, points, completed } = task;
  
  // Handle button click with comprehensive event prevention
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Completely stop all event propagation and default behaviors
    e.preventDefault();
    e.stopPropagation();
    
    if (!completed && !isSubmitting && isUserLoggedIn) {
      onComplete(id);
    }
  };

  // Get icon based on task type
  const getIcon = () => {
    switch(id) {
      case 'comments':
        return <MessageCircle className="h-4 w-4" />;
      case 'creators':
        return <Heart className="h-4 w-4" />;
      case 'story':
        return <Camera className="h-4 w-4" />;
      case 'multiplatform':
        return <Share2 className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Button 
      type="button"
      variant={completed ? "default" : "outline"} 
      className={cn(
        "w-full h-12 justify-between px-3 py-2 transition-all duration-200",
        completed 
          ? "bg-green-500 hover:bg-green-600 text-white border-green-400" 
          : "text-chichi-purple hover:bg-chichi-purple-soft border-chichi-purple/30",
        "hover:shadow-md hover:scale-[1.02]",
        isSubmitting && "animate-pulse cursor-wait"
      )}
      disabled={isSubmitting || !isUserLoggedIn || completed}
      onClick={handleClick}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex-shrink-0 mr-2">
          {completed ? <Check className="h-4 w-4" /> : getIcon()}
        </div>
        <span className="text-xs font-medium truncate">{label}</span>
      </div>
      
      {!completed && (
        <div className="flex items-center justify-center bg-chichi-orange/20 text-chichi-orange py-1 px-2 rounded-full flex-shrink-0 ml-2">
          <Star className="h-3 w-3 mr-1" />
          <span className="text-xs font-bold">+{points}</span>
        </div>
      )}
    </Button>
  );
};
