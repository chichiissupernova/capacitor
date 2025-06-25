import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();
  
  // If user already has a name, don't show this component
  if (user?.name) return null;
  
  return (
    <Card className="bg-gradient-to-r from-chichi-orange/80 to-chichi-purple/80 text-white">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Welcome to CHICHI!</h2>
          <p className="text-sm mt-1">
            Ready to start your content creation journey?
          </p>
        </div>
        <Button asChild variant="secondary" size="sm" className="bg-white text-chichi-purple hover:bg-gray-100">
          <a href="/profile">
            Personalize <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

