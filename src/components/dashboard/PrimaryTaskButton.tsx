
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Task = {
  id: string;
  label: string;
  points: number;
  completed: boolean;
};

interface PrimaryTaskButtonProps {
  task: Task;
  isSubmitting: boolean;
  isUserLoggedIn: boolean;
  onComplete: (taskId: string) => void;
}

export const PrimaryTaskButton = ({ 
  task, 
  isSubmitting, 
  isUserLoggedIn, 
  onComplete
}: PrimaryTaskButtonProps) => {
  const { id, label, points, completed } = task;
  const [showGlow, setShowGlow] = useState(false);
  
  // Handle button click with comprehensive event prevention
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Completely stop all event propagation and default behaviors
    e.preventDefault();
    e.stopPropagation();
    
    if (!completed && !isSubmitting && isUserLoggedIn) {
      setShowGlow(true);
      onComplete(id);
    }
  };

  // Clear glow effect after animation
  useEffect(() => {
    if (showGlow) {
      const timer = setTimeout(() => setShowGlow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showGlow]);

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      {(showGlow || completed) && (
        <div className={cn(
          "absolute inset-0 rounded-full opacity-75 blur-lg animate-pulse",
          completed ? "bg-green-400" : "bg-chichi-purple"
        )} />
      )}
      
      {/* Main button */}
      <Button 
        type="button"
        variant={completed ? "default" : "outline"} 
        className={cn(
          "relative w-32 h-32 rounded-full text-center p-4 transition-all duration-300",
          "shadow-lg hover:shadow-xl transform hover:scale-105",
          completed 
            ? "bg-green-500 hover:bg-green-600 text-white border-green-400" 
            : "bg-white hover:bg-chichi-purple-soft text-chichi-purple border-2 border-chichi-purple",
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
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Icon */}
          <div className="flex-shrink-0">
            {completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Check className="h-8 w-8" />
              </motion.div>
            ) : isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Send className="h-8 w-8" />
              </motion.div>
            ) : (
              <Send className="h-8 w-8" />
            )}
          </div>
          
          {/* Label */}
          <div className="text-xs font-medium leading-tight">
            {completed ? "Posted!" : isSubmitting ? "Posting..." : "Post to Page"}
          </div>
          
          {/* Points badge */}
          {!completed && (
            <div className="flex items-center justify-center bg-chichi-orange text-white py-1 px-2 rounded-full">
              <Star className="h-3 w-3 mr-1" />
              <span className="text-xs font-bold">{points}</span>
            </div>
          )}
        </div>
      </Button>
    </motion.div>
  );
};
