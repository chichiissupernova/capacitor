
import React from 'react';

interface BrandVaultUserStatusProps {
  userPoints: number;
}

export const BrandVaultUserStatus: React.FC<BrandVaultUserStatusProps> = ({ userPoints }) => {
  return (
    <div className="text-center">
      <div className="text-sm text-muted-foreground">
        Available Points: <span className="font-medium text-chichi-orange">{userPoints.toLocaleString()}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Keep earning points to unlock exclusive brand marketplace rewards
      </div>
    </div>
  );
};
