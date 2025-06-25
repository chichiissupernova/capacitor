
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect, memo, useRef } from 'react';

interface PointsCardProps {
  totalPoints: number;
  levelPoints: number;
  maxLevelPoints: number;
  level: number;
  className?: string;
}

export const PointsCard = memo(({ totalPoints, levelPoints, maxLevelPoints, level, className }: PointsCardProps) => {
  const [pendingPoints, setPendingPoints] = useState(0);
  const [animatePoints, setAnimatePoints] = useState(false);
  const animationTimeoutRef = useRef<number | null>(null);
  const pendingTimeoutRef = useRef<number | null>(null);

  // Listen for task completion events with enhanced debouncing
  useEffect(() => {
    const handleTaskComplete = (event: CustomEvent) => {
      const { points } = event.detail;
      
      // Clear any existing timeouts to prevent conflicts
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
      
      // Add pending points with smooth transition
      setPendingPoints(prev => prev + points);
      setAnimatePoints(true);
      
      // Clear animation after a delay
      animationTimeoutRef.current = window.setTimeout(() => {
        setAnimatePoints(false);
      }, 800);
      
      // Clear pending points after actual points update with longer delay
      pendingTimeoutRef.current = window.setTimeout(() => {
        setPendingPoints(0);
      }, 3000);
    };

    window.addEventListener('task-completed', handleTaskComplete as EventListener);
    
    return () => {
      window.removeEventListener('task-completed', handleTaskComplete as EventListener);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, []);

  // Make sure we have valid values to prevent NaN in the UI and cap level at 100
  const validTotalPoints = isNaN(totalPoints) ? 0 : Math.max(0, totalPoints);
  const validLevelPoints = isNaN(levelPoints) ? 0 : Math.max(0, levelPoints);
  const validMaxLevelPoints = isNaN(maxLevelPoints) || maxLevelPoints <= 0 ? 100 : maxLevelPoints;
  const validLevel = isNaN(level) || level <= 0 ? 1 : Math.min(level, 100);
  
  // Calculate display values with pending points
  const displayTotalPoints = validTotalPoints + pendingPoints;
  const displayLevelPoints = validLevelPoints + pendingPoints;
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (displayLevelPoints / validMaxLevelPoints) * 100);
  const [showRewards, setShowRewards] = useState(false);
  
  // Mock rewards data
  const rewards = [
    { name: "Content Template Pack", points: 200, icon: "📁" },
    { name: "Exclusive Badge", points: 500, icon: "🏆" },
    { name: "Analytics Report", points: 350, icon: "📊" },
  ];
  
  return (
    <div className={cn(
      "rounded-xl p-5 border border-border shadow-sm transition-all duration-500",
      pendingPoints > 0 && "transform scale-[1.02]",
      className
    )}>
      <div className="flex items-center mb-3">
        <Star className={cn(
          "h-5 w-5 mr-2 transition-all duration-500",
          pendingPoints > 0 ? "text-chichi-orange animate-pulse scale-110" : "text-chichi-orange"
        )} />
        <h3 className="font-semibold text-lg">Your Points</h3>
      </div>
      
      <div className="flex items-baseline">
        <span className={cn(
          "text-3xl font-bold mr-1 transition-all duration-700",
          pendingPoints > 0 ? "text-chichi-orange scale-110" : "text-chichi-orange",
          animatePoints && "animate-pulse"
        )}>
          {displayTotalPoints.toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground">points</span>
        {pendingPoints > 0 && (
          <span className="text-sm font-medium text-chichi-orange ml-2 animate-bounce transition-all duration-300">
            +{pendingPoints}
          </span>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Level {validLevel}</span>
          <span className="text-muted-foreground">
            {displayLevelPoints}/{validMaxLevelPoints} points
          </span>
        </div>
        <Progress 
          value={progressPercentage} 
          className={cn(
            "h-2 transition-all duration-1000",
            pendingPoints > 0 && "animate-pulse"
          )}
          style={{ 
            background: '#f3f3f3',
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Current</span>
          <span>Next Level: {Math.max(0, validMaxLevelPoints - displayLevelPoints)} points needed</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button 
          variant="ghost" 
          className="w-full text-chichi-orange hover:text-chichi-orange hover:bg-orange-50 transition-all duration-200"
          onClick={() => setShowRewards(!showRewards)}
        >
          {showRewards ? "Hide Rewards" : "View Available Rewards"}
        </Button>
        
        {showRewards && (
          <div className="mt-3 space-y-2 animate-fade-in">
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-lg text-sm transition-all duration-200 hover:bg-gray-50">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{reward.icon}</span>
                  <span>{reward.name}</span>
                </div>
                <span className="font-medium text-chichi-orange">{reward.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

PointsCard.displayName = 'PointsCard';
