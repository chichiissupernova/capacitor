
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserMinus, Award, Flame, Clock } from 'lucide-react';
import { UserProfileModal } from './UserProfileModal';

interface CreatorCardProps {
  creator: {
    id: string;
    name: string | null;
    username: string | null;
    avatar_url: string | null;
    points: number | null;
    current_streak: number | null;
    level: number | null;
    follower_count: number;
    niche_preferences: string[] | null;
  };
  isFollowing: boolean;
  isPending: boolean;
  isProcessing: boolean;
  onFollow: (creatorId: string) => void;
  onUnfollow: (creatorId: string) => void;
}

export function CreatorCard({ 
  creator, 
  isFollowing, 
  isPending,
  isProcessing, 
  onFollow, 
  onUnfollow 
}: CreatorCardProps) {
  const [showModal, setShowModal] = React.useState(false);
  
  const displayName = creator.name || creator.username || 'Unknown Creator';
  
  const handleFollowClick = () => {
    if (isFollowing) {
      onUnfollow(creator.id);
    } else {
      onFollow(creator.id);
    }
  };

  const handleMessage = (userId: string, userName: string) => {
    // Close modal and navigate to messages
    setShowModal(false);
    // Message functionality would be implemented here
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Link to={`/u/${creator.username}`}>
              <Avatar className="h-12 w-12 hover:opacity-80 transition-opacity">
                <AvatarImage src={creator.avatar_url || ""} alt={displayName} />
                <AvatarFallback className="bg-chichi-purple text-white">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Link 
                  to={`/u/${creator.username}`}
                  className="hover:underline"
                >
                  <h3 className="font-medium text-sm truncate">{displayName}</h3>
                </Link>
                <Badge variant="outline" className="text-xs">
                  Level {creator.level || 1}
                </Badge>
              </div>
              
              {creator.username && (
                <Link 
                  to={`/u/${creator.username}`}
                  className="text-xs text-gray-600 hover:underline"
                >
                  @{creator.username}
                </Link>
              )}
              
              {/* Stats */}
              <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3 text-chichi-purple" />
                  <span>{creator.points || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span>{creator.current_streak || 0}</span>
                </div>
                <div>
                  <span>{creator.follower_count} followers</span>
                </div>
              </div>

              {/* Niches */}
              {creator.niche_preferences && creator.niche_preferences.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {creator.niche_preferences.slice(0, 2).map((niche) => (
                    <Badge key={niche} variant="secondary" className="text-xs">
                      {niche}
                    </Badge>
                  ))}
                  {creator.niche_preferences.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{creator.niche_preferences.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 mt-3">
            <Button
              onClick={handleFollowClick}
              disabled={isProcessing || isPending}
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              className={`flex-1 text-xs ${
                isFollowing 
                  ? "text-red-600 border-red-200 hover:bg-red-50" 
                  : isPending
                  ? "text-orange-600 border-orange-200 bg-orange-50"
                  : "bg-chichi-purple hover:bg-chichi-purple-dark text-white"
              }`}
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
              ) : isPending ? (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </>
              ) : isFollowing ? (
                <>
                  <UserMinus className="h-3 w-3 mr-1" />
                  Disconnect
                </>
              ) : (
                <>
                  <UserPlus className="h-3 w-3 mr-1" />
                  Connect
                </>
              )}
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-chichi-purple text-chichi-purple hover:bg-chichi-purple hover:text-white text-xs"
            >
              <Link to={`/u/${creator.username}`}>
                View Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={creator.id}
        isFollowing={isFollowing}
        isProcessing={isProcessing}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
        onMessage={handleMessage}
      />
    </>
  );
}
