import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';

export const OnboardingTutorial: React.FC = () => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  
  useEffect(() => {
    // Check if the user has seen the tutorial before
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    
    // If the user is logged in and hasn't seen the tutorial, show it
    if (user && !hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [user]);
  
  const handleClose = () => {
    setShowTutorial(false);
    // Set a flag in local storage so we don't show the tutorial again
    localStorage.setItem('hasSeenTutorial', 'true');
  };
  
  if (!showTutorial) {
    return null;
  }
  
  return (
    <Card className="mb-8 border-2 border-chichi-purple bg-[#F6F4FF]/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-chichi-purple">Welcome to CHICHI!</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Thanks for joining the CHICHI community! Here's a quick guide to get you started:
        </p>
        <ol className="list-decimal pl-5 mt-4 space-y-2">
          <li>Complete your daily tasks to earn points.</li>
          <li>Check out the leaderboard to see how you stack up against other creators.</li>
          <li>Engage with other creators in the community feed.</li>
        </ol>
        <Button onClick={handleClose} className="mt-4 bg-chichi-purple hover:bg-chichi-purple-dark">
          Got it!
        </Button>
      </CardContent>
    </Card>
  );
};
