
import React from 'react';

export const BadgeEarningGuide: React.FC = () => {
  return (
    <div className="bg-chichi-purple-soft rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-lg mb-2">How to Earn Badges</h3>
      <p className="text-sm mb-3">Badges are earned by completing specific achievements in your content journey:</p>
      <ul className="text-sm space-y-1.5">
        <li className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-chichi-purple flex items-center justify-center text-white text-xs">
            1
          </div>
          <span>Post consistently to build your streak</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-chichi-purple flex items-center justify-center text-white text-xs">
            2
          </div>
          <span>Complete specific types of content (videos, stories, etc.)</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-chichi-purple flex items-center justify-center text-white text-xs">
            3
          </div>
          <span>Hit milestone targets for points and level ups</span>
        </li>
      </ul>
    </div>
  );
};
