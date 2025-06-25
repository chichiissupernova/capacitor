
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy } from 'lucide-react';
import { UserProfileActions } from './UserProfileActions';

interface PublicUserProfile {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  points: number | null;
  level: number | null;
  niche_preferences: string[] | null;
}

interface PublicProfileHeaderProps {
  profile: PublicUserProfile;
  isOwnProfile: boolean;
  isFollowing: boolean;
  isProcessing: boolean;
  user: any;
  onFollow: () => void;
  onMessage: () => void;
}

export function PublicProfileHeader({
  profile,
  isOwnProfile,
  isFollowing,
  isProcessing,
  user,
  onFollow,
  onMessage
}: PublicProfileHeaderProps) {
  const navigate = useNavigate();
  const displayName = profile.name || profile.username || 'Unknown Creator';

  return (
    <>
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-chichi-purple/10 to-chichi-orange/10 border-2 border-chichi-purple/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24 border-4 border-chichi-purple/20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-chichi-purple text-white text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
              {profile.username && (
                <p className="text-xl text-gray-600 mb-3">@{profile.username}</p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <Badge variant="secondary" className="bg-chichi-purple text-white">
                  Level {profile.level || 1}
                </Badge>
                {profile.points && profile.points >= 1000 && (
                  <Badge variant="secondary" className="bg-chichi-orange text-white">
                    <Trophy className="h-3 w-3 mr-1" />
                    Top Performer
                  </Badge>
                )}
              </div>
              
              {/* Content Niche */}
              {profile.niche_preferences && profile.niche_preferences.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Content Niche</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {profile.niche_preferences.slice(0, 2).map((niche) => (
                      <Badge key={niche} variant="outline" className="border-chichi-purple text-chichi-purple">
                        {niche}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {!isOwnProfile && user && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <UserProfileActions
                isFollowing={isFollowing}
                isProcessing={isProcessing}
                onFollow={onFollow}
                onMessage={onMessage}
              />
            </div>
          )}

          {isOwnProfile && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={() => navigate('/profile')}
                className="w-full md:w-auto bg-chichi-purple hover:bg-chichi-purple/90"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
