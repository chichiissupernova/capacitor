
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FollowedCreator {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  current_streak: number;
  points: number;
  level: number;
}

interface FollowedCreatorsListProps {
  creators: FollowedCreator[];
}

export function FollowedCreatorsList({ creators }: FollowedCreatorsListProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Following ({creators.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {creators.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-3">
              You're not following anyone yet
            </p>
            <Button 
              size="sm" 
              onClick={() => navigate('/creator-connect')}
              className="bg-chichi-orange hover:bg-chichi-orange-dark"
            >
              Find Creators
            </Button>
          </div>
        ) : (
          creators.map((creator) => (
            <div key={creator.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={creator.avatar_url || ""} alt={creator.name || ""} />
                <AvatarFallback>
                  {creator.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {creator.name || `@${creator.username}`}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    {creator.current_streak}
                  </span>
                  <span>•</span>
                  <span>Lvl {creator.level}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
