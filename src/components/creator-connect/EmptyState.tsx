
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        {searchQuery ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">No creators found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-2">No creators yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to complete your profile and start connecting with other creators!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
