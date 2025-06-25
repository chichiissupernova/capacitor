
import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <>
      {/* Main progress bar that connects all steps */}
      <div className="absolute h-0.5 w-full bg-gray-200 top-1/2 -translate-y-1/2 z-0"></div>
      
      {/* Animated progress overlay */}
      <div 
        className="absolute h-0.5 bg-chichi-purple top-1/2 -translate-y-1/2 z-10 transition-all duration-500" 
        style={{ 
          width: `${percentage}%`,
          maxWidth: '100%'
        }}
      />
    </>
  );
};
