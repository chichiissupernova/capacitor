
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, MessageSquare, Clock } from 'lucide-react';

interface UserProfileActionsProps {
  isFollowing: boolean;
  isPending?: boolean;
  isProcessing: boolean;
  onFollow: () => void;
  onMessage: () => void;
}

export function UserProfileActions({ 
  isFollowing, 
  isPending = false,
  isProcessing, 
  onFollow, 
  onMessage 
}: UserProfileActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        onClick={onFollow}
        disabled={isProcessing || isPending}
        variant={isFollowing ? "outline" : "default"}
        className={`flex-1 ${
          isFollowing 
            ? "text-red-600 border-red-200 hover:bg-red-50" 
            : isPending
            ? "text-orange-600 border-orange-200 bg-orange-50"
            : "bg-chichi-purple hover:bg-chichi-purple-dark text-white"
        }`}
      >
        {isProcessing ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
        ) : isPending ? (
          <>
            <Clock className="h-4 w-4 mr-1" />
            Connection Pending
          </>
        ) : isFollowing ? (
          <>
            <UserMinus className="h-4 w-4 mr-1" />
            Disconnect
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-1" />
            Connect
          </>
        )}
      </Button>
      
      <Button
        onClick={onMessage}
        variant="outline"
        className="flex-1 border-chichi-purple text-chichi-purple hover:bg-chichi-purple hover:text-white"
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        Message
      </Button>
    </div>
  );
}
