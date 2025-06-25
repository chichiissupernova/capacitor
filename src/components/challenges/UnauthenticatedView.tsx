
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

export function UnauthenticatedView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto text-chichi-orange mb-4" />
          <h2 className="text-xl font-bold mb-2">Join CHICHI First</h2>
          <p className="text-gray-600 mb-4">
            You need to create an account to accept this challenge invite.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Sign Up / Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
