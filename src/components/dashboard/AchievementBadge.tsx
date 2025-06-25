
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Award, Check } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  className?: string;
}

export const AchievementBadge = ({ 
  name, 
  description, 
  icon, 
  unlocked, 
  className 
}: AchievementBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "aspect-square rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200",
              unlocked 
                ? "bg-gradient-to-br from-chichi-purple/20 to-chichi-pink/20 border-chichi-purple hover:shadow-md" 
                : "bg-gray-100 opacity-60 grayscale",
              className
            )}
          >
            <div 
              className={cn(
                "text-3xl mb-1",
                unlocked ? "" : "text-gray-400"
              )}
            >
              {icon}
            </div>
            <span className="text-sm font-medium text-center">{name}</span>
            {unlocked && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <Check className="h-3 w-3 mr-1" /> Unlocked
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="p-1">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
