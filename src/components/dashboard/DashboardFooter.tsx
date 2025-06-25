
import React from 'react';
import { SyncStatusIndicator } from '@/components/sync/SyncStatusIndicator';

interface DashboardFooterProps {
  betaVersion: string;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({ betaVersion }) => {
  return (
    <div className="mt-8 pt-4 pb-6 border-t flex flex-row justify-between items-center text-sm text-muted-foreground">
      <div>
        <span className="text-xs">Beta v{betaVersion}</span>
      </div>
      <div className="flex items-center">
        <SyncStatusIndicator className="text-xs" />
      </div>
    </div>
  );
};
