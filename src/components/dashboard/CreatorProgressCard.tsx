import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Flame, Star, Award, ChevronRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { StreakRecoveryDialog } from '@/components/dashboard/StreakRecoveryDialog';

interface CreatorProgressCardProps {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  levelPoints: number;
  maxLevelPoints: number;
  level: number;
  canRecoverStreak?: boolean;
  className?: string;
}

export const CreatorProgressCard = ({
  currentStreak,
  longestStreak,
  totalPoints,
  levelPoints,
  maxLevelPoints,
  level,
  canRecoverStreak = false,
  className
}: CreatorProgressCardProps) => {
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const { updateUserStreak } = useAuth();
  const navigate = useNavigate();
  
  // Ensure streak values are valid numbers
  const safeCurrentStreak = typeof currentStreak === 'number' && !isNaN(currentStreak) && currentStreak >= 0 
    ? currentStreak 
    : 0;
    
  const safeLongestStreak = typeof longestStreak === 'number' && !isNaN(longestStreak) && longestStreak >= 0 
    ? longestStreak 
    : 0;
  
  // Calculate percentage for the progress bar
  const progressPercentage = (levelPoints / maxLevelPoints) * 100;
  
  // Determine if streak is "hot" (5+ days)
  const isHotStreak = safeCurrentStreak >= 5;
  
  const handleRecoveryComplete = () => {
    setShowRecoveryDialog(false);
    
    if (updateUserStreak) {
      updateUserStreak();
    }
  };

  return (
    <>
      <div className={cn(
        "bg-white rounded-xl p-5 border border-border shadow-sm", 
        className
      )}>
        <h3 className="font-semibold text-lg mb-4">Your Creator Progress</h3>
        
        {/* Streak Section */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className={cn(
              "p-2 rounded-full relative",
              isHotStreak ? "bg-orange-50" : ""
            )}>
              <Flame 
                className={cn(
                  "h-5 w-5",
                  isHotStreak 
                    ? "text-chichi-orange animate-pulse" 
                    : "text-chichi-orange"
                )}
              />
              {isHotStreak && (
                <div className="absolute inset-0 rounded-full bg-chichi-orange/20 animate-ping" />
              )}
            </div>
            <div className="ml-2">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-chichi-orange">{safeCurrentStreak}</span>
                <span className="text-sm text-muted-foreground ml-1">day streak</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {safeLongestStreak > safeCurrentStreak ? 
                  `Best: ${safeLongestStreak} days` : 
                  "Your best streak yet!"}
              </div>
            </div>
          </div>
          
          {/* Streak recovery notice if applicable */}
          {canRecoverStreak && (
            <div className="mb-3">
              <div 
                className="flex items-center gap-1.5 bg-amber-50 rounded-lg p-2.5 text-xs cursor-pointer"
                onClick={() => setShowRecoveryDialog(true)}
              >
                <Award className="h-4 w-4 text-amber-500" />
                <span className="text-amber-700 font-medium">Missed a day? Tap to recover your streak</span>
              </div>
            </div>
          )}
          
          {/* 7-day streak calendar */}
          <div className="mb-3">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, i) => {
                // Show streaks for the last 7 days, right-to-left (most recent on the right)
                const isActive = i < Math.min(safeCurrentStreak, 7);
                
                return (
                  <div 
                    key={i}
                    className={cn(
                      "aspect-square rounded-full w-5 h-5",
                      isActive ? "bg-chichi-orange" : "bg-gray-100"
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-100 my-4"></div>
        
        {/* Points Section */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <Star className="h-5 w-5 text-chichi-orange mr-2" />
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-chichi-orange mr-1">{totalPoints}</span>
                <span className="text-sm text-muted-foreground">points</span>
              </div>
              <div className="text-xs text-muted-foreground">Level {level}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Level Progress</span>
              <span className="text-muted-foreground">{levelPoints}/{maxLevelPoints}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2" 
              style={{ background: '#f3f3f3' }}
            />
            <div className="text-xs text-muted-foreground">
              {maxLevelPoints - levelPoints} points needed for next level
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button
          variant="outline"
          className="w-full mt-2 border-dashed flex justify-between"
          onClick={() => navigate('/streaks')}
        >
          <div className="flex items-center">
            <Gift className="h-4 w-4 mr-2 text-chichi-purple" />
            <span>View Rewards</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Streak recovery dialog */}
      <StreakRecoveryDialog 
        open={showRecoveryDialog} 
        onOpenChange={setShowRecoveryDialog}
        onRecoveryComplete={handleRecoveryComplete}
      />
    </>
  );
};
