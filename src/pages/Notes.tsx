
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotesHeader } from '@/components/notes/NotesHeader';
import { NotesContent } from '@/components/notes/NotesContent';
import { NotesDialogs } from '@/components/notes/NotesDialogs';
import { useNotes } from '@/hooks/useNotes';

const NotesPage = () => {
  const {
    notes,
    collections,
    editingNote,
    setEditingNote,
    deletingNoteId,
    setDeletingNoteId,
    deletingCollectionId,
    setDeletingCollectionId,
    handleAddNote,
    handleAddCollection,
    handleUpdateNote,
    handleDeleteNote,
    handleDeleteCollection,
  } = useNotes();

  const [activeTab, setActiveTab] = useState('notes');
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  
  // Filtered notes based on active collection
  const filteredNotes = activeCollectionId
    ? notes.filter(note => note.collectionId === activeCollectionId)
    : notes.filter(note => !note.collectionId);
  
  // Enter a collection
  const handleEnterCollection = (collectionId: string) => {
    setActiveCollectionId(collectionId);
    setActiveTab('notes');
  };
  
  // Return to main view from a collection
  const handleBackToMain = () => {
    setActiveCollectionId(null);
  };
  
  // Get current collection if viewing a collection
  const currentCollection = activeCollectionId
    ? collections.find(c => c.id === activeCollectionId)
    : null;

  // Edit note handler
  const handleEditNote = (id: string) => {
    const noteToEdit = notes.find(n => n.id === id);
    setEditingNote(noteToEdit || null);
  };
  
  return (
    <div className="animate-fade-in">
      <NotesHeader
        activeCollectionId={activeCollectionId}
        currentCollection={currentCollection}
        onBackToMain={handleBackToMain}
        onAddNote={(noteData) => handleAddNote(noteData, activeCollectionId || undefined)}
        onAddCollection={handleAddCollection}
      />
      
      {!activeCollectionId && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="notes">All Notes</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <NotesContent
        activeTab={activeTab}
        activeCollectionId={activeCollectionId}
        filteredNotes={filteredNotes}
        collections={collections}
        notes={notes}
        onEditNote={handleEditNote}
        onDeleteNote={setDeletingNoteId}
        onEnterCollection={handleEnterCollection}
        onDeleteCollection={setDeletingCollectionId}
      />
      
      <NotesDialogs
        editingNote={editingNote}
        setEditingNote={setEditingNote}
        deletingNoteId={deletingNoteId}
        setDeletingNoteId={setDeletingNoteId}
        deletingCollectionId={deletingCollectionId}
        setDeletingCollectionId={setDeletingCollectionId}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        onDeleteCollection={handleDeleteCollection}
      />
    </div>
  );
};

export default NotesPage;
