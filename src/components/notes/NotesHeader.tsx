
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { AddNoteDialog } from './AddNoteDialog';
import { AddCollectionDialog } from './AddCollectionDialog';
import { Collection, AddNoteData, AddCollectionData } from '@/types/notes';

interface NotesHeaderProps {
  activeCollectionId: string | null;
  currentCollection: Collection | null;
  onBackToMain: () => void;
  onAddNote: (noteData: AddNoteData) => void;
  onAddCollection: (collectionData: AddCollectionData) => void;
}

export const NotesHeader = ({
  activeCollectionId,
  currentCollection,
  onBackToMain,
  onAddNote,
  onAddCollection,
}: NotesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      {activeCollectionId ? (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBackToMain}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {currentCollection?.name}
          </h1>
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-foreground">Notes & Ideas</h1>
      )}
      
      <div className="flex gap-2">
        {activeCollectionId === null && (
          <AddCollectionDialog onAddCollection={onAddCollection} />
        )}
        <AddNoteDialog 
          collectionId={activeCollectionId || undefined} 
          onAddNote={onAddNote} 
        />
      </div>
    </div>
  );
};
