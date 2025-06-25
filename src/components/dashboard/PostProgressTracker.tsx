
import React from 'react';
import { Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ContentProgressTracker } from './ContentProgressTracker';
import { SyncStatusIndicator } from '@/components/sync/SyncStatusIndicator';

interface PostProgressTrackerProps {
  onComplete?: () => void;
}

export const PostProgressTracker: React.FC<PostProgressTrackerProps> = ({ onComplete }) => {
  return (
    <Card className="mb-6 border border-chichi-purple/20 relative">
      <SyncStatusIndicator className="absolute top-2 right-2" />
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg flex items-center">
              <Send className="mr-2 h-5 w-5 text-chichi-purple" />
              Content Creation Progress
            </h3>
          </div>
        </div>
        
        <ContentProgressTracker />
      </CardContent>
    </Card>
  );
};
