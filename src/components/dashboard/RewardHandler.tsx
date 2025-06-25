
import React, { useState, useEffect } from 'react';
import { RewardAnimation } from '@/components/animations/RewardAnimation';

interface RewardHandlerProps {
  children: (showReward: (points: number, badgeUnlocked?: string) => void) => React.ReactNode;
}

export const RewardHandler: React.FC<RewardHandlerProps> = ({ children }) => {
  const [showReward, setShowReward] = useState<{ show: boolean; points: number; badgeUnlocked?: string }>({
    show: false, 
    points: 0
  });

  // Auto-dismiss the reward after 3 seconds
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (showReward.show) {
      timeoutId = window.setTimeout(() => {
        handleRewardComplete();
      }, 3000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showReward.show]);

  const handleShowReward = (points: number, badgeUnlocked?: string) => {
    setShowReward({ show: true, points, badgeUnlocked });
  };

  const handleRewardComplete = () => {
    setShowReward({ show: false, points: 0 });
  };

  return (
    <>
      {children(handleShowReward)}
      
      {showReward.show && (
        <RewardAnimation 
          points={showReward.points}
          badgeUnlocked={showReward.badgeUnlocked}
          onComplete={handleRewardComplete} 
        />
      )}
    </>
  );
};
