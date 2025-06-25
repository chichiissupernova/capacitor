
import React from 'react';
import { EditNoteDialog } from './EditNoteDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Note, UpdateNoteData } from '@/types/notes';

interface NotesDialogsProps {
  editingNote: Note | null;
  setEditingNote: (note: Note | null) => void;
  deletingNoteId: string | null;
  setDeletingNoteId: (id: string | null) => void;
  deletingCollectionId: string | null;
  setDeletingCollectionId: (id: string | null) => void;
  onUpdateNote: (id: string, updates: UpdateNoteData) => void;
  onDeleteNote: (id: string) => void;
  onDeleteCollection: (id: string) => void;
}

export const NotesDialogs = ({
  editingNote,
  setEditingNote,
  deletingNoteId,
  setDeletingNoteId,
  deletingCollectionId,
  setDeletingCollectionId,
  onUpdateNote,
  onDeleteNote,
  onDeleteCollection,
}: NotesDialogsProps) => {
  return (
    <>
      {/* Edit Note Dialog */}
      {editingNote && (
        <EditNoteDialog
          open={!!editingNote}
          onOpenChange={(open) => {
            if (!open) setEditingNote(null);
          }}
          note={editingNote}
          onUpdate={onUpdateNote}
        />
      )}
      
      {/* Delete Note Confirmation */}
      <AlertDialog
        open={!!deletingNoteId}
        onOpenChange={(open) => {
          if (!open) setDeletingNoteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deletingNoteId && onDeleteNote(deletingNoteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Collection Confirmation */}
      <AlertDialog
        open={!!deletingCollectionId}
        onOpenChange={(open) => {
          if (!open) setDeletingCollectionId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
            <AlertDialogDescription>
              The collection will be deleted, but all notes will be moved to Uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deletingCollectionId && onDeleteCollection(deletingCollectionId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
