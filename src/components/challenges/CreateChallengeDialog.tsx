
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateChallengeDialogProps {
  onCreateChallenge: (username: string) => void;
  isLoading?: boolean;
}

export const CreateChallengeDialog: React.FC<CreateChallengeDialogProps> = ({
  onCreateChallenge,
  isLoading = false
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');

  const handleCreate = () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a CHICHI username to challenge",
        variant: "destructive",
      });
      return;
    }

    onCreateChallenge(username.trim());
    setIsOpen(false);
    setUsername('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Trophy className="h-4 w-4 mr-2" />
          Start Challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-chichi-orange" />
            Challenge a Creator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Challenge another creator to a 5-day content consistency battle! Compete to see who can earn the most points.
          </p>

          <div className="space-y-2">
            <Label htmlFor="usernameInput" className="text-sm font-medium">
              CHICHI Username
            </Label>
            <Input
              id="usernameInput"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter their username"
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-chichi-orange" />
              <span className="text-sm font-medium">5-Day Challenge</span>
            </div>
            <p className="text-xs text-gray-600">
              Compare total points earned from daily tasks over 5 days
            </p>
          </div>

          <Button 
            onClick={handleCreate}
            disabled={isLoading || !username.trim()}
            className="w-full"
          >
            {isLoading ? 'Sending Challenge...' : 'Send Challenge'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
