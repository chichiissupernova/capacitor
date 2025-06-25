
import React, { useEffect } from 'react';

interface ProgressCelebrationProps {
  visible: boolean;
  onClose?: () => void;
}

export const ProgressCelebration: React.FC<ProgressCelebrationProps> = ({ visible, onClose }) => {
  useEffect(() => {
    if (visible && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white p-6 rounded-lg text-center animate-scale-in">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="text-xl font-bold text-chichi-purple mb-2">All Steps Complete!</h3>
        <p>Great job completing your content creation process!</p>
      </div>
    </div>
  );
};
