
import React from 'react';
import { Award, Flame, Calendar } from 'lucide-react';

interface UserProfileStatsProps {
  points: number | null;
  currentStreak: number | null;
  followerCount: number;
  followingCount: number;
  joinedDate: string;
}

export function UserProfileStats({ 
  points, 
  currentStreak, 
  followerCount, 
  followingCount, 
  joinedDate 
}: UserProfileStatsProps) {
  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Award className="h-4 w-4 text-chichi-purple" />
            <span className="font-bold">{points || 0}</span>
          </div>
          <p className="text-xs text-gray-600">Points</p>
        </div>
        <div>
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-bold">{currentStreak || 0}</span>
          </div>
          <p className="text-xs text-gray-600">Streak</p>
        </div>
        <div>
          <p className="font-bold">{followerCount}</p>
          <p className="text-xs text-gray-600">Followers</p>
        </div>
        <div>
          <p className="font-bold">{followingCount}</p>
          <p className="text-xs text-gray-600">Following</p>
        </div>
      </div>

      {/* Join Date */}
      <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        <span>Joined {joinedDate}</span>
      </div>
    </>
  );
}
