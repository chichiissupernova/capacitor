
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useContentProgress } from '@/hooks/useContentProgress';
import { ProgressStep } from './ProgressStep';
import { ProgressBar } from './ProgressBar';
import { ProgressCelebration } from './ProgressCelebration';
import { LightbulbIcon, Mic, Pen, Text, Send, Check } from 'lucide-react';
import type { PostStep } from '@/hooks/useContentProgress';

export const ContentProgressTracker: React.FC = () => {
  const {
    progressState,
    isLoading,
    isSaving,
    celebrationVisible,
    getCompletedStepsCount,
    progressPercentage,
    handleStepClick,
  } = useContentProgress();
  
  // Define the steps
  const steps: {id: PostStep, label: string, icon: React.ReactNode, activeIcon: React.ReactNode}[] = [
    { 
      id: 'idea', 
      label: 'Idea', 
      icon: <LightbulbIcon className="h-5 w-5" />,
      activeIcon: <Check className="h-5 w-5" />
    },
    { 
      id: 'recording', 
      label: 'Recording', 
      icon: <Mic className="h-5 w-5" />,
      activeIcon: <Check className="h-5 w-5" />
    },
    { 
      id: 'editing', 
      label: 'Editing', 
      icon: <Pen className="h-5 w-5" />, 
      activeIcon: <Check className="h-5 w-5" />
    },
    { 
      id: 'caption', 
      label: 'Caption', 
      icon: <Text className="h-5 w-5" />, 
      activeIcon: <Check className="h-5 w-5" />
    },
    { 
      id: 'post', 
      label: 'Post', 
      icon: <Send className="h-5 w-5" />, 
      activeIcon: <Check className="h-5 w-5" />
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-base">Progress</h3>
          <Badge variant="outline" className="bg-chichi-purple/5">
            {getCompletedStepsCount()}/5 Complete
          </Badge>
        </div>
      </div>
      
      <div className="flex justify-between items-center relative pt-2">
        <ProgressBar percentage={progressPercentage} />
        
        {/* Step circles */}
        {steps.map((step) => (
          <ProgressStep
            key={step.id}
            id={step.id}
            label={step.label}
            icon={step.icon}
            activeIcon={step.activeIcon}
            isComplete={progressState[step.id]}
            isLoading={isLoading}
            isSaving={isSaving}
            onClick={() => handleStepClick(step.id)}
          />
        ))}
      </div>

      <ProgressCelebration visible={celebrationVisible} />
    </div>
  );
};

