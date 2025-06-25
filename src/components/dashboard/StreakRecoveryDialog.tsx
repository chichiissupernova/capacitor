import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Coins, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

interface StreakRecoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecoveryComplete: () => void;
}

export const StreakRecoveryDialog: React.FC<StreakRecoveryDialogProps> = ({
  open,
  onOpenChange,
  onRecoveryComplete
}) => {
  const { user, updateUserStreak } = useAuth();
  const [isRecovering, setIsRecovering] = useState(false);
  
  const handleRecoverStreak = async () => {
    if (!user?.id || isRecovering || !updateUserStreak) return;
    
    setIsRecovering(true);
    
    try {
      // Call the updateUserStreak function to recover the streak
      await updateUserStreak();
      
      // Notify parent component that recovery is complete
      onRecoveryComplete();
    } catch (error) {
      console.error("Error recovering streak:", error);
      // Handle error appropriately, e.g., show a toast
    } finally {
      setIsRecovering(false);
      onOpenChange(false); // Close the dialog
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recover Your Streak?</DialogTitle>
          <DialogDescription>
            Looks like you missed a day! Use 50 points to continue your streak.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-between">
            <span>Current Points:</span>
            <Badge>
              {user?.points || 0} <Coins className="h-3 w-3 ml-1" />
            </Badge>
          </div>
          
          {user && user.points && user.points < 50 && (
            <div className="mt-2 p-3 rounded-md bg-amber-500/10 border border-amber-500 text-amber-700 text-sm">
              <AlertTriangle className="h-4 w-4 mr-2 inline-block align-middle" />
              Insufficient points to recover streak.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isRecovering}>
            Cancel
          </Button>
          <Button 
            type="button" 
            className="bg-chichi-orange hover:bg-chichi-orange/90"
            onClick={handleRecoverStreak}
            disabled={isRecovering || !user || !user.points || user.points < 50}
          >
            {isRecovering ? (
              <>
                <Flame className="mr-2 h-4 w-4 animate-spin" />
                Recovering...
              </>
            ) : (
              <>
                <Flame className="mr-2 h-4 w-4" />
                Recover Streak (-50)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
