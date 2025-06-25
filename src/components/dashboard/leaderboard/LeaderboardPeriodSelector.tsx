
import React from 'react';
import { Button } from '@/components/ui/button';
import { LeaderboardPeriod } from '@/hooks/useLeaderboard';

interface LeaderboardPeriodSelectorProps {
  selectedPeriod: LeaderboardPeriod;
  onPeriodChange: (period: LeaderboardPeriod) => void;
}

export const LeaderboardPeriodSelector: React.FC<LeaderboardPeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange
}) => {
  const periodButtons: { key: LeaderboardPeriod; label: string }[] = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'all-time', label: 'All-Time' }
  ];

  return (
    <div className="flex gap-2">
      {periodButtons.map(({ key, label }) => (
        <Button
          key={key}
          variant={selectedPeriod === key ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(key)}
          className="text-xs"
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
