import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Filter, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Challenge } from '@/hooks/useChallenges';
import { useAuth } from '@/contexts/auth';

interface PastChallengesSectionProps {
  challenges: Challenge[];
  onRematch: (challengeId: string) => void;
}

export const PastChallengesSection: React.FC<PastChallengesSectionProps> = ({ 
  challenges, 
  onRematch 
}) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'completed' | 'expired'>('all');

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'all') return true;
    return challenge.status === filter;
  });

  const getOpponentInfo = (challenge: Challenge) => {
    const isChallenger = challenge.challenger_id === user?.id;
    return isChallenger ? challenge.opponent_profile : challenge.challenger_profile;
  };

  const getMyPoints = (challenge: Challenge) => {
    const isChallenger = challenge.challenger_id === user?.id;
    return isChallenger ? challenge.challenger_points : challenge.opponent_points;
  };

  const getOpponentPoints = (challenge: Challenge) => {
    const isChallenger = challenge.challenger_id === user?.id;
    return isChallenger ? challenge.opponent_points : challenge.challenger_points;
  };

  const getWinner = (challenge: Challenge) => {
    if (challenge.status === 'expired') return 'Expired';
    
    const myPoints = getMyPoints(challenge);
    const opponentPoints = getOpponentPoints(challenge);
    
    if (myPoints > opponentPoints) return 'You';
    if (opponentPoints > myPoints) return 'Opponent';
    return 'Tie';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge className="bg-green-500 text-white">✅ Completed</Badge>;
    }
    return <Badge variant="outline" className="text-red-600 border-red-300">❌ Expired</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-chichi-orange" />
            Past Challenges
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
            <Button
              variant={filter === 'expired' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('expired')}
            >
              Expired
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No past challenges yet'
                : `No ${filter} challenges yet`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opponent</TableHead>
                  <TableHead className="text-center">Length</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Final Score</TableHead>
                  <TableHead className="text-center">Winner</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChallenges.map((challenge) => {
                  const opponent = getOpponentInfo(challenge);
                  const myPoints = getMyPoints(challenge);
                  const opponentPoints = getOpponentPoints(challenge);
                  const winner = getWinner(challenge);

                  return (
                    <TableRow key={challenge.id}>
                      <TableCell>
                        <div className="font-medium">
                          @{opponent?.username || opponent?.name || 'Unknown'}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {challenge.challenge_length} days
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {getStatusBadge(challenge.status)}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-bold text-chichi-orange">{myPoints}</span>
                          <span className="text-gray-400">vs</span>
                          <span className="font-bold text-chichi-purple">{opponentPoints}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {winner === 'You' && (
                          <Badge className="bg-green-500 text-white">You</Badge>
                        )}
                        {winner === 'Opponent' && (
                          <Badge variant="outline" className="text-gray-600">Opponent</Badge>
                        )}
                        {winner === 'Tie' && (
                          <Badge variant="secondary">Tie</Badge>
                        )}
                        {winner === 'Expired' && (
                          <Badge variant="outline" className="text-red-600 border-red-300">
                            Expired
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {challenge.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRematch(challenge.id)}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Rematch
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
