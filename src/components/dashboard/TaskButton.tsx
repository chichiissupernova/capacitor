
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Task = {
  id: string;
  label: string;
  points: number;
  completed: boolean;
};

interface TaskButtonProps {
  task: Task;
  isSubmitting: boolean;
  isUserLoggedIn: boolean;
  onComplete: (taskId: string) => void;
  textClassName?: string;
}

export const TaskButton = ({ 
  task, 
  isSubmitting, 
  isUserLoggedIn, 
  onComplete,
  textClassName
}: TaskButtonProps) => {
  const { id, label, points, completed } = task;
  
  // Handle button click with preventDefault to stop any form submission
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('TaskButton click prevented defaults:', { id, completed, isSubmitting, isUserLoggedIn });
    
    if (!completed && !isSubmitting && isUserLoggedIn) {
      console.log('TaskButton calling onComplete for:', id);
      onComplete(id);
    } else {
      console.log('TaskButton click blocked:', { 
        completed, 
        isSubmitting, 
        isUserLoggedIn 
      });
    }
  };

  return (
    <Button 
      type="button"
      variant={completed ? "default" : "outline"} 
      className={cn(
        "w-full justify-between h-auto py-3 px-4 transition-all duration-300",
        completed ? "bg-chichi-purple text-white" : "text-chichi-purple hover:bg-chichi-purple-soft",
        isSubmitting && "opacity-70 cursor-not-allowed scale-98",
        "transform hover:scale-[1.02]"
      )}
      disabled={isSubmitting || !isUserLoggedIn || completed}
      onClick={handleClick}
    >
      <div className="flex items-center flex-grow min-w-0 mr-2">
        {completed ? (
          <Check className="h-4 w-4 mr-2 shrink-0" />
        ) : (
          <div className="h-4 w-4 mr-2 shrink-0" />
        )}
        <span className={cn("font-medium text-left", textClassName)}>{label}</span>
      </div>
      
      <div className="flex items-center justify-center bg-white/20 py-1 px-2 rounded-full shrink-0">
        <Star className="h-3 w-3 mr-1 flex-shrink-0" />
        <span className="text-xs font-medium">{points}</span>
      </div>
    </Button>
  );
};
