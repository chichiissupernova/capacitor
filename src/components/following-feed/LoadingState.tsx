
import React from 'react';

export function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chichi-orange mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your feed...</p>
      </div>
    </div>
  );
}
