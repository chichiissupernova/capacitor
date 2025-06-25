
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StickyNote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActionsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2 px-3 md:px-6">
        <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <Button
          onClick={() => navigate('/notes')}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <StickyNote className="h-4 w-4" />
          Notes & Ideas
        </Button>
      </CardContent>
    </Card>
  );
};
