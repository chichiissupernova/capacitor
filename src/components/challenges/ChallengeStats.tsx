
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Target, Users, Clock } from 'lucide-react';

export const ChallengeStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-4 w-4 text-chichi-orange" />
          <span className="text-sm text-gray-600">Total Challenges</span>
        </div>
        <p className="text-2xl font-bold">3</p>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-600">Wins</span>
        </div>
        <p className="text-2xl font-bold">2</p>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-chichi-purple" />
          <span className="text-sm text-gray-600">Win Rate</span>
        </div>
        <p className="text-2xl font-bold">67%</p>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-chichi-lime" />
          <span className="text-sm text-gray-600">Current Streak</span>
        </div>
        <p className="text-2xl font-bold">2</p>
      </Card>
    </div>
  );
};
