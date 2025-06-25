
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UsernameSetupNoticeProps {
  needsUsername: boolean;
}

export const UsernameSetupNotice: React.FC<UsernameSetupNoticeProps> = ({ needsUsername }) => {
  const navigate = useNavigate();

  if (!needsUsername) return null;

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 border-2">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-orange-500" />
          <div className="flex-1">
            <p className="font-bold text-orange-800">Warrior Name Required</p>
            <p className="text-sm text-orange-700">
              Set up your creator username to enter the showdown arena and challenge other creators!
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            <Swords className="h-4 w-4 mr-2" />
            Choose Name
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
