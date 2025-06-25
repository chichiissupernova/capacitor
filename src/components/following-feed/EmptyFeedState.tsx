
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyFeedStateProps {
  hasFollowedCreators: boolean;
}

export function EmptyFeedState({ hasFollowedCreators }: EmptyFeedStateProps) {
  const navigate = useNavigate();

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
        <p className="text-gray-600 mb-4">
          {!hasFollowedCreators 
            ? "Start following creators to see their activity here!"
            : "The creators you follow haven't been active recently. Check back later!"
          }
        </p>
        <Button 
          onClick={() => navigate('/creator-connect')}
          className="bg-chichi-orange hover:bg-chichi-orange-dark"
        >
          Discover Creators
        </Button>
      </CardContent>
    </Card>
  );
}
