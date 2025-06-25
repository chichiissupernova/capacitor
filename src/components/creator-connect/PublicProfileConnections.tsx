
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

interface ConnectedCreator {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface PublicProfileConnectionsProps {
  connectedCreators: ConnectedCreator[];
}

export function PublicProfileConnections({ connectedCreators }: PublicProfileConnectionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-chichi-purple">
          <Users className="h-5 w-5" />
          Connected Creators ({connectedCreators.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {connectedCreators.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No connections yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {connectedCreators.map((creator) => (
              <div key={creator.id} className="text-center">
                <Avatar className="h-12 w-12 mx-auto mb-2 border-2 border-chichi-purple/20">
                  <AvatarImage src={creator.avatar_url || undefined} />
                  <AvatarFallback className="bg-chichi-purple/10 text-chichi-purple">
                    {(creator.name || creator.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs font-medium truncate">
                  {creator.name || creator.username || 'Unknown'}
                </p>
                {creator.username && (
                  <p className="text-xs text-gray-500 truncate">@{creator.username}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
