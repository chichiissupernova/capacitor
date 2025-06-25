
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Swords, Flame } from 'lucide-react';

interface ShowdownLobbyProps {
  onStartShowdown: () => void;
}

export const ShowdownLobby: React.FC<ShowdownLobbyProps> = ({ onStartShowdown }) => {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
      <CardContent className="text-center py-12">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="h-20 w-20 text-orange-500" />
              <Flame className="h-8 w-8 text-red-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
              ⚔️ Enter the Arena
            </h3>
            <p className="text-gray-700 text-lg mb-2">
              Ready for an epic creator showdown?
            </p>
            <p className="text-gray-600 mb-6">
              Challenge another creator to see who can earn the most points in a daily content battle!
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={onStartShowdown}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-3 h-auto"
            >
              <Swords className="h-5 w-5 mr-2" />
              Create Challenge
            </Button>
            
            <div className="bg-white/70 rounded-lg p-4 border border-orange-200 max-w-md mx-auto">
              <p className="text-sm text-gray-700">
                🔥 Choose your battle duration, share the invite link, and may the best creator win!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
