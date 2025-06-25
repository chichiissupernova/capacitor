
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Copy, Check } from 'lucide-react';
import { Challenge } from '@/hooks/useChallenges';
import { useToast } from '@/hooks/use-toast';

interface AwaitingOpponentCardProps {
  challenge: Challenge;
}

export const AwaitingOpponentCard: React.FC<AwaitingOpponentCardProps> = ({ challenge }) => {
  const { toast } = useToast();
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyInviteLink = async () => {
    if (!challenge.invite_token) return;

    const inviteLink = `${window.location.origin}/challenge/invite?token=${challenge.invite_token}`;
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      toast({
        title: "🔗 Link Copied!",
        description: "Invite link copied to clipboard - share it to start the duel!",
      });
      
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
      <CardContent className="text-center py-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="h-16 w-16 text-yellow-500" />
              <div className="absolute inset-0 animate-ping">
                <Trophy className="h-16 w-16 text-yellow-500 opacity-50" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-800 mb-2">⏳ Awaiting Opponent</h3>
            <p className="text-yellow-700 mb-4">
              Your showdown challenge is waiting for an opponent to accept the duel...
            </p>
            
            {/* Invite Link Section */}
            {challenge.invite_token && (
              <div className="bg-white/80 rounded-lg p-4 border border-yellow-300 max-w-md mx-auto mb-4">
                <p className="text-sm font-medium text-yellow-800 mb-2">Share this invite link:</p>
                <div className="flex gap-2">
                  <Input
                    value={`${window.location.origin}/challenge/invite?token=${challenge.invite_token}`}
                    readOnly
                    className="flex-1 text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyInviteLink}
                    className="flex items-center gap-1"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <div className="bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-sm text-yellow-800">
                🔥 Challenge expires in 24 hours if not accepted
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
