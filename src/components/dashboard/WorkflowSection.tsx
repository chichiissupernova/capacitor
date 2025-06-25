
import React from 'react';
import { Send } from 'lucide-react';
import { ContentProgressTracker } from './ContentProgressTracker';
import { DailyTaskButtons } from './DailyTaskButtons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WorkflowSection: React.FC = () => {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2 px-3 md:px-6">
        <CardTitle className="text-lg md:text-xl flex items-center">
          <Send className="mr-2 h-4 w-4 md:h-5 md:w-5 text-chichi-purple" />
          Today's Content Workflow
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <div className="space-y-4 md:space-y-6">
          {/* Daily Tasks Section - Now first */}
          <div className="pb-1 md:pb-2">
            <h3 className="font-medium text-base md:text-lg mb-3 md:mb-4">Daily Tasks</h3>
            <DailyTaskButtons />
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gray-100 w-full my-3 md:my-4" />
          
          {/* Content Progress Tracker - Now second */}
          <div>
            <ContentProgressTracker />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
