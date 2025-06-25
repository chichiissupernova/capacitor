
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

interface UserWin {
  id: string;
  title: string;
  platform: string;
  tags: string[];
  date: string;
}

interface PublicProfileWinsProps {
  recentWins: UserWin[];
}

export function PublicProfileWins({ recentWins }: PublicProfileWinsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-chichi-purple">
            <Trophy className="h-5 w-5" />
            Recent Wins
          </span>
          {recentWins.length > 0 && (
            <Button variant="outline" size="sm">
              View Full Win Wall
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentWins.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No wins shared yet</p>
        ) : (
          <div className="space-y-3">
            {recentWins.map((win) => (
              <div key={win.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{win.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {win.platform}
                  </Badge>
                </div>
                {win.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {win.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
