
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserProfileHeaderProps {
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  level: number | null;
}

export function UserProfileHeader({ displayName, username, avatarUrl, level }: UserProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="bg-chichi-purple text-white text-lg">
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{displayName}</h3>
        {username && (
          <p className="text-gray-600">@{username}</p>
        )}
        <Badge variant="outline" className="mt-1">
          Level {level || 1}
        </Badge>
      </div>
    </div>
  );
}
