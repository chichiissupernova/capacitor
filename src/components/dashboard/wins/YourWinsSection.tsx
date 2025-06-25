
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useWins } from '@/hooks/useWins';
import { WinCard } from './WinCard';
import { LogWinModal } from './LogWinModal';
import { CommunityWinsModal } from './CommunityWinsModal';

export function YourWinsSection() {
  const { wins, isLoading } = useWins();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  return (
    <>
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2 px-3 md:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl">Your Wins</CardTitle>
            <Button
              onClick={() => setShowLogModal(true)}
              size="sm"
              className="bg-chichi-purple hover:bg-chichi-purple-dark"
            >
              <Plus className="h-4 w-4 mr-1" />
              Log a New Win
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-32 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : wins.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No wins logged yet!</p>
              <Button
                onClick={() => setShowLogModal(true)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Log Your First Win
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {wins.map(win => (
                <WinCard key={win.id} win={win} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <LogWinModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onViewCommunity={() => {
          setShowLogModal(false);
          setShowCommunityModal(true);
        }}
      />

      <CommunityWinsModal
        isOpen={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
      />
    </>
  );
}
