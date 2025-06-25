
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Zap, Users, Flame } from 'lucide-react';

export const ShowdownHeader: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <Zap className="h-6 w-6 text-orange-500 absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">
              Creator Showdown
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Battle fellow creators in epic content creation duels
            </p>
          </div>
          <div className="relative">
            <Users className="h-12 w-12 text-purple-500" />
            <Flame className="h-6 w-6 text-red-500 absolute -top-1 -right-1" />
          </div>
        </div>
      </div>

      {/* Battle Rules Banner */}
      <Card className="bg-gradient-to-r from-red-50 via-orange-50 to-purple-50 border-2 border-orange-200 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <Flame className="h-6 w-6 text-red-500" />
              Battle Arena Rules
              <Flame className="h-6 w-6 text-red-500" />
            </h3>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="bg-white/80 rounded-lg p-3 border border-orange-200">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">Instant Battle</span>
                </div>
                <p className="text-gray-600">Showdowns begin immediately when opponent accepts</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="font-semibold">One vs One</span>
                </div>
                <p className="text-gray-600">Only 1 active showdown at a time per creator</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Trophy className="h-4 w-4 text-green-500" />
                  <span className="font-semibold">Points Battle</span>
                </div>
                <p className="text-gray-600">Earn points through completed CHICHI tasks</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-600 bg-yellow-50 rounded-lg p-2 border border-yellow-200">
              ⚡ Pro Tip: Challenge invites expire in 24 hours - accept quickly to start the battle!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
