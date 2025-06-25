
import { useAuth } from '@/contexts/auth/useAuth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Star } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const UserPointsDisplay = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [displayPoints, setDisplayPoints] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [pendingPoints, setPendingPoints] = useState(0);
  
  // Update display values immediately when user data changes
  useEffect(() => {
    if (user) {
      const points = Math.max(0, user.points || 0);
      const level = Math.max(1, user.level || 1);
      
      // Update immediately without animation for better responsiveness
      setDisplayPoints(points);
      setDisplayLevel(level);
      
      // Clear pending points when actual points catch up
      if (pendingPoints > 0 && user.points >= displayPoints + pendingPoints) {
        setPendingPoints(0);
      }
    }
  }, [user?.points, user?.level]);

  // Listen for task completion events to show optimistic updates
  useEffect(() => {
    const handleTaskComplete = (event: CustomEvent) => {
      const { points } = event.detail;
      setPendingPoints(prev => prev + points);
      
      // Clear pending points after a timeout as fallback
      setTimeout(() => {
        setPendingPoints(0);
      }, 3000);
    };

    window.addEventListener('task-completed', handleTaskComplete as EventListener);
    return () => window.removeEventListener('task-completed', handleTaskComplete as EventListener);
  }, []);
  
  const handleClick = () => {
    navigate('/streaks');
  };
  
  if (!user) {
    return null;
  }
  
  const totalDisplayPoints = displayPoints + pendingPoints;
  const formattedPoints = new Intl.NumberFormat().format(totalDisplayPoints);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={cn(
              "flex items-center gap-2 py-1.5 px-3 rounded-lg transition-all",
              isHovering ? "bg-chichi-purple-soft" : "hover:bg-chichi-purple-soft/50"
            )}
          >
            <div className="flex items-center gap-1 text-sm font-medium">
              <Award className="h-4 w-4 text-chichi-purple" />
              <span>Level {displayLevel}</span>
            </div>
            
            <div className="h-4 w-px bg-gray-300" />
            
            <div className="flex items-center gap-1 text-sm font-medium">
              <Star className={cn(
                "h-4 w-4",
                pendingPoints > 0 ? "text-chichi-orange animate-pulse" : "text-yellow-500"
              )} />
              <span className={cn(
                "transition-all duration-200",
                pendingPoints > 0 && "text-chichi-orange font-bold"
              )}>
                {formattedPoints} pts
                {pendingPoints > 0 && (
                  <span className="text-xs ml-1 text-chichi-orange animate-bounce">
                    (+{pendingPoints})
                  </span>
                )}
              </span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View your achievements and stats</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserPointsDisplay;
