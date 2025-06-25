
import React, { useState, useCallback } from 'react';
import { Crown } from 'lucide-react';
import { CreateChallengeModal } from './CreateChallengeModal';
import { PastChallengesSection } from './PastChallengesSection';
import { ShowdownHeader } from './ShowdownHeader';
import { UsernameSetupNotice } from './UsernameSetupNotice';
import { ActiveChallengeSection } from './ActiveChallengeSection';
import { useChallenges } from '@/hooks/useChallenges';
import { useAuth } from '@/contexts/auth/useAuth';
import { useToast } from '@/hooks/use-toast';

export const EnhancedChallengeHub: React.FC = () => {
  const { user } = useAuth();
  const { activeChallenge, pastChallenges, createChallenge, cancelChallenge, isLoading } = useChallenges();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // Use a safer approach for toast to avoid React queue issues
  const { toast } = useToast();
  
  const showToast = useCallback((title: string, description: string, variant?: "default" | "destructive") => {
    try {
      toast({
        title,
        description,
        variant,
      });
    } catch (error) {
      console.error('Toast error:', error);
      // Fallback to console log if toast fails
      console.log(`${title}: ${description}`);
    }
  }, [toast]);

  const handleCreateChallenge = async (challengeLength: number, inviteMethod: 'link') => {
    try {
      console.log('Creating challenge with length:', challengeLength);
      const challengeData = await createChallenge(challengeLength, inviteMethod);
      console.log('Challenge created:', challengeData);
      
      if (challengeData) {
        showToast(
          "🏟️ Showdown Arena Created!",
          "Share the battle invite link to start an epic creator duel!"
        );
        return challengeData;
      } else {
        throw new Error('Failed to create challenge - no data returned');
      }
    } catch (error) {
      console.error('Error in handleCreateChallenge:', error);
      const message = error instanceof Error ? error.message : 'Failed to create showdown';
      showToast(
        "Showdown Creation Failed",
        message,
        "destructive"
      );
      throw error;
    }
  };

  const handleCancelChallenge = async () => {
    if (!activeChallenge || isCanceling) return;

    setIsCanceling(true);
    try {
      const success = await cancelChallenge(activeChallenge.id);
      if (success) {
        showToast(
          "⚔️ Showdown Canceled",
          "Your showdown challenge has been canceled successfully."
        );
      } else {
        showToast(
          "Error",
          "Failed to cancel showdown. Please try again.",
          "destructive"
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      showToast(
        "Error",
        message,
        "destructive"
      );
    } finally {
      setIsCanceling(false);
    }
  };

  const handleRematch = (challengeId: string) => {
    showToast(
      "🔥 Rematch Feature",
      "Rematch functionality coming soon to the arena!"
    );
  };

  // Check if user needs to set up username for challenges
  const needsUsername = !user?.username;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ShowdownHeader />
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading the arena...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Showdown Header */}
      <ShowdownHeader />

      {/* Username Setup Notice */}
      <UsernameSetupNotice needsUsername={needsUsername} />

      {/* Active Showdown Section */}
      <ActiveChallengeSection
        activeChallenge={activeChallenge}
        currentUserId={user?.id || ''}
        isCanceling={isCanceling}
        onCancelChallenge={handleCancelChallenge}
        onStartShowdown={() => setIsCreateModalOpen(true)}
      />

      {/* Past Showdowns Section */}
      {pastChallenges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Crown className="h-6 w-6 text-purple-500" />
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Battle History
            </span>
          </h2>
          <PastChallengesSection
            challenges={pastChallenges}
            onRematch={handleRematch}
          />
        </div>
      )}

      {/* Create Challenge Modal */}
      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateChallenge={handleCreateChallenge}
        isLoading={isLoading}
      />
    </div>
  );
};
