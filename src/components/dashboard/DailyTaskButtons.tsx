
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { PrimaryTaskButton } from '@/components/dashboard/PrimaryTaskButton';
import { BonusTaskButton } from '@/components/dashboard/BonusTaskButton';
import { RewardHandler } from '@/components/dashboard/RewardHandler';
import { useDailyTasks } from '@/hooks/useDailyTasks';

export const DailyTaskButtons = () => {
  const { user } = useAuth();
  const { tasks, isLoading, isSubmitting, handleCompleteTask } = useDailyTasks();
  
  // Find the primary task (post) and bonus tasks
  const primaryTask = tasks.find(task => task.id === 'post');
  const bonusTasks = tasks.filter(task => 
    ['comments', 'creators', 'story', 'multiplatform'].includes(task.id)
  );

  // Update bonus task labels to match beta requirements
  const updatedBonusTasks = bonusTasks.map(task => {
    switch(task.id) {
      case 'comments':
        return { ...task, label: 'Replied to Comments' };
      case 'creators':
        return { ...task, label: 'Engaged with Creators' };
      case 'story':
        return { ...task, label: 'Posted to My Story' };
      case 'multiplatform':
        return { ...task, label: 'Posted to Multiple Platforms' };
      default:
        return task;
    }
  });
  
  // Wrap everything in a div to prevent any form submission behavior
  const handleTaskClick = (taskId: string, showReward?: (points: number) => void) => {
    handleCompleteTask(taskId, showReward);
  };
  
  return (
    <RewardHandler>
      {(showReward) => (
        <div className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
          {/* Primary Task - Large Circular Button */}
          <div className="flex justify-center">
            {isLoading ? (
              <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            ) : primaryTask ? (
              <PrimaryTaskButton
                task={primaryTask}
                isSubmitting={isSubmitting}
                isUserLoggedIn={!!user}
                onComplete={(taskId) => {
                  handleTaskClick(taskId, showReward);
                }}
              />
            ) : null}
          </div>

          {/* Bonus Tasks - Stacked vertically */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-600 text-center">Bonus Tasks ({updatedBonusTasks.length}/4)</h4>
            <div className="space-y-2">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={`loading-bonus-${index}`} className="h-12 bg-gray-200 animate-pulse rounded-lg" />
                ))
              ) : (
                updatedBonusTasks.map(task => (
                  <BonusTaskButton
                    key={task.id}
                    task={task}
                    isSubmitting={isSubmitting}
                    isUserLoggedIn={!!user}
                    onComplete={(taskId) => {
                      handleTaskClick(taskId, showReward);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </RewardHandler>
  );
};
