
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ProgressStepProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  isComplete: boolean;
  isLoading: boolean;
  isSaving: boolean;
  onClick: () => void;
}

export const ProgressStep: React.FC<ProgressStepProps> = ({
  id,
  label,
  icon,
  activeIcon,
  isComplete,
  isLoading,
  isSaving,
  onClick
}) => {
  return (
    <div className="flex flex-col items-center z-20">
      <Button
        onClick={onClick}
        disabled={isLoading || isSaving}
        variant={isComplete ? "default" : "outline"}
        size="icon"
        className={`rounded-full h-10 w-10 relative ${
          isComplete ? "bg-chichi-purple text-white" : "text-chichi-purple"
        } ${isLoading || isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={`${isComplete ? 'Mark' : 'Unmark'} ${label} as complete`}
      >
        {isSaving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          isComplete ? activeIcon : icon
        )}
      </Button>
      <span className="text-xs mt-2 font-medium">{label}</span>
    </div>
  );
};
