
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';
import { Challenge } from '@/hooks/useChallenges';
import { PlayerVsPlayerCard } from './PlayerVsPlayerCard';
import { ShowdownLobby } from './ShowdownLobby';
import { AwaitingOpponentCard } from './AwaitingOpponentCard';

interface ActiveChallengeSectionProps {
  activeChallenge: Challenge | null;
  currentUserId: string;
  isCanceling: boolean;
  onCancelChallenge: () => void;
  onStartShowdown: () => void;
}

export const ActiveChallengeSection: React.FC<ActiveChallengeSectionProps> = ({
  activeChallenge,
  currentUserId,
  isCanceling,
  onCancelChallenge,
  onStartShowdown
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Current Showdown
          </span>
        </div>
        {activeChallenge && activeChallenge.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelChallenge}
            disabled={isCanceling}
            className="ml-auto border-red-300 text-red-600 hover:bg-red-50"
          >
            {isCanceling ? 'Canceling...' : 'Cancel Duel'}
          </Button>
        )}
      </h2>
      
      {activeChallenge ? (
        activeChallenge.status === 'active' ? (
          <PlayerVsPlayerCard 
            challenge={activeChallenge} 
            currentUserId={currentUserId} 
          />
        ) : activeChallenge.status === 'pending' ? (
          <AwaitingOpponentCard challenge={activeChallenge} />
        ) : null
      ) : (
        <ShowdownLobby onStartShowdown={onStartShowdown} />
      )}
    </div>
  );
};
