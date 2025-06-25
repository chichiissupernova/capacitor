
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ChallengeJoinLoaderProps {
  isJoining: boolean;
  debugInfo?: string;
}

export function ChallengeJoinLoader({ isJoining, debugInfo }: ChallengeJoinLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chichi-orange"></div>
              <h3 className="text-lg font-semibold mt-4">
                {isJoining ? 'Joining Challenge...' : 'Loading Challenge...'}
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                {isJoining 
                  ? 'Please wait while we set up your challenge...' 
                  : 'Validating challenge invitation...'}
              </p>
            </div>
            
            {debugInfo && (
              <div className="bg-blue-50 border border-blue-200 p-3 mt-6 rounded-lg text-left">
                <p className="text-sm font-mono text-blue-800 break-words">
                  Debug: {debugInfo}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
