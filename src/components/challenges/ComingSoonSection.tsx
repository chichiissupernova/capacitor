
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Calendar } from 'lucide-react';

export const ComingSoonSection: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-chichi-orange" />
          Coming Soon
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-chichi-purple" />
            <span className="text-sm">Group Challenges (up to 5 people)</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-chichi-orange" />
            <span className="text-sm">3 & 7-day challenges</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-green-500" />
            <span className="text-sm">Tournament Mode</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
