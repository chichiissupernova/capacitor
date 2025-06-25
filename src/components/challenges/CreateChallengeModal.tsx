
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Link, ArrowLeft, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChallenge: (challengeLength: number, inviteMethod: 'link', username?: string) => Promise<any>;
  isLoading: boolean;
}

type Step = 'length' | 'confirm' | 'waiting';

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  onClose,
  onCreateChallenge,
  isLoading
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('length');
  const [selectedLength, setSelectedLength] = useState<number>(5);
  const [inviteLink, setInviteLink] = useState('');

  const handleClose = () => {
    setStep('length');
    setSelectedLength(5);
    setInviteLink('');
    onClose();
  };

  const handleLengthSelect = (length: number) => {
    setSelectedLength(length);
    setStep('confirm');
  };

  const handleCreateChallenge = async () => {
    try {
      const challengeData = await onCreateChallenge(selectedLength, 'link');
      
      if (challengeData?.invite_token) {
        // Generate the proper invite link with the actual token
        const link = `${window.location.origin}/challenge/invite?token=${challengeData.invite_token}`;
        setInviteLink(link);
        setStep('waiting');
      }
    } catch (error) {
      // Error is already handled in the parent component
      console.error('Error in modal:', error);
    }
  };

  const copyToClipboard = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
    }
  };

  const lengthOptions = [
    { days: 3, label: '3 Days', description: 'Quick sprint' },
    { days: 5, label: '5 Days', description: 'Standard challenge' },
    { days: 7, label: '7 Days', description: 'Extended battle' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-chichi-orange" />
            Create New Challenge
            {(step === 'confirm' || step === 'waiting') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('length')}
                className="ml-auto"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === 'length' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Select Challenge Length</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose how many days you want to compete. A unique invite link will be generated.
              </p>
            </div>

            <div className="space-y-3">
              {lengthOptions.map((option) => (
                <button
                  key={option.days}
                  onClick={() => handleLengthSelect(option.days)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedLength === option.days
                      ? 'border-chichi-orange bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-gray-400" />
                      {selectedLength === option.days && (
                        <Badge className="bg-chichi-orange text-white">Selected</Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 A unique invite link will be generated that you can share with anyone.
                The link expires in 24 hours.
              </p>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4 text-center">
            <div>
              <Trophy className="h-16 w-16 mx-auto text-chichi-orange mb-4" />
              <h3 className="font-medium mb-2">Ready to Create Challenge?</h3>
              <p className="text-sm text-gray-600 mb-4">
                You're about to create a {selectedLength}-day challenge. An invite link will be generated for you to share.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
              <p className="text-sm text-orange-800">
                🔥 Challenge Duration: {selectedLength} days
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('length')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateChallenge}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creating...' : 'Create Challenge'}
              </Button>
            </div>
          </div>
        )}

        {step === 'waiting' && (
          <div className="space-y-4 text-center">
            <div>
              <Trophy className="h-16 w-16 mx-auto text-chichi-orange mb-4" />
              <h3 className="font-medium mb-2">Challenge Created!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Share this link with your friend to start the {selectedLength}-day challenge
              </p>
            </div>

            <div className="space-y-3">
              <Label>Invite Link:</Label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⏰ This link expires in 24 hours
                </p>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
