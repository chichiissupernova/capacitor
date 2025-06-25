
import React from 'react';
import { NoteCard } from './NoteCard';
import { CollectionCard } from './CollectionCard';
import { Note, Collection } from '@/types/notes';

interface NotesContentProps {
  activeTab: string;
  activeCollectionId: string | null;
  filteredNotes: Note[];
  collections: Collection[];
  notes: Note[];
  onEditNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onEnterCollection: (collectionId: string) => void;
  onDeleteCollection: (id: string) => void;
}

export const NotesContent = ({
  activeTab,
  activeCollectionId,
  filteredNotes,
  collections,
  notes,
  onEditNote,
  onDeleteNote,
  onEnterCollection,
  onDeleteCollection,
}: NotesContentProps) => {
  if (activeTab === 'notes' || activeCollectionId) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredNotes.map(note => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            color={note.color}
            createdAt={note.createdAt}
            onEdit={onEditNote}
            onDelete={onDeleteNote}
          />
        ))}
        {filteredNotes.length === 0 && (
          <div className="col-span-full text-center p-8 rounded-lg border border-dashed">
            <p className="text-muted-foreground">
              No notes yet. Click "New Note" to add one.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {collections.map(collection => {
        const collectionNotesCount = notes.filter(note => note.collectionId === collection.id).length;
        return (
          <CollectionCard
            key={collection.id}
            id={collection.id}
            name={collection.name}
            description={collection.description}
            notesCount={collectionNotesCount}
            onClick={() => onEnterCollection(collection.id)}
            onDelete={() => onDeleteCollection(collection.id)}
          />
        );
      })}
      {collections.length === 0 && (
        <div className="col-span-full text-center p-8 rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            No collections yet. Click "New Collection" to create one.
          </p>
        </div>
      )}
    </div>
  );
};
