
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar, AlertCircle } from 'lucide-react';
import { useChallenges } from '@/hooks/useChallenges';
import { useAuth } from '@/contexts/auth';
import { CurrentChallengeCard } from './CurrentChallengeCard';
import { CreateChallengeModal } from './CreateChallengeModal';
import { PastChallengesSection } from './PastChallengesSection';
import { Badge } from '@/components/ui/badge';

export const ChallengeHub: React.FC = () => {
  const { user } = useAuth();
  const { activeChallenge, pastChallenges, isLoading } = useChallenges();
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const handleRematch = (challengeId: string) => {
    // TODO: Implement rematch functionality
    console.log('Rematch requested for challenge:', challengeId);
  };

  const handleCreateChallenge = async (challengeLength: number, inviteMethod: 'username' | 'link', username?: string) => {
    // TODO: Implement challenge creation
    console.log('Creating challenge:', { challengeLength, inviteMethod, username });
    setShowCreateModal(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chichi-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Creator Challenges</h1>
          <p className="text-gray-600 mt-1">
            1v1 content consistency battles with fellow creators
          </p>
        </div>
        {!activeChallenge && (
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-chichi-orange hover:bg-chichi-orange/90"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Start New Challenge
          </Button>
        )}
      </div>

      {/* Challenge Rules Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-chichi-orange" />
            How It Works
          </h3>
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-chichi-purple" />
              <span>Challenge starts immediately after acceptance</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-chichi-orange" />
              <span>Only 1 active challenge at a time</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-green-500" />
              <span>Points based on completed CHICHI tasks</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            💡 Tip: Invite links expire in 24 hours if not accepted
          </div>
        </CardContent>
      </Card>

      {/* Current Challenge Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-chichi-orange" />
          Current Challenge
        </h2>
        
        {activeChallenge ? (
          <CurrentChallengeCard challenge={activeChallenge} />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Challenge</h3>
              <p className="text-gray-600 mb-6">
                Ready to test your content creation consistency? Challenge a fellow creator!
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-chichi-orange hover:bg-chichi-orange/90"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Start New Challenge
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Challenges Section */}
      {pastChallenges.length > 0 && (
        <PastChallengesSection 
          challenges={pastChallenges} 
          onRematch={handleRematch}
        />
      )}

      {/* Create Challenge Modal */}
      <CreateChallengeModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateChallenge={handleCreateChallenge}
        isLoading={false}
      />
    </div>
  );
};
