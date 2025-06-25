
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChallengeInviteButtonProps {
  inviteToken?: string;
  challengeId?: string;
}

export const ChallengeInviteButton: React.FC<ChallengeInviteButtonProps> = ({ 
  inviteToken,
  challengeId 
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!inviteToken) {
    return null;
  }

  const inviteUrl = `${window.location.origin}/challenge/invite?token=${inviteToken}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Challenge invite link has been copied to your clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleCopyLink}
      variant="outline"
      className="flex items-center gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Invite Link
        </>
      )}
    </Button>
  );
};
