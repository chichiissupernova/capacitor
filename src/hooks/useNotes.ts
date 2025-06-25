
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Note, Collection, AddNoteData, AddCollectionData, UpdateNoteData } from '@/types/notes';

// Sample data for demonstration
const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Content Calendar Ideas',
    content: 'Weekly Instagram post about behind-the-scenes\nMonthly YouTube tutorial on content creation\nDaily Twitter tips',
    color: 'yellow',
    createdAt: new Date('2023-05-01')
  },
  {
    id: '2',
    title: 'Engagement Strategy',
    content: 'Respond to comments within 2 hours\nAsk questions in captions\nCreate polls in stories\nCollaborate with other creators',
    color: 'blue',
    createdAt: new Date('2023-05-02')
  },
  {
    id: '3',
    title: 'Video Ideas',
    content: 'Day in the life\nMorning routine\nFavorite tools and apps\nQ&A with audience questions',
    color: 'green',
    collectionId: 'content-ideas',
    createdAt: new Date('2023-05-03')
  }
];

const initialCollections: Collection[] = [
  {
    id: 'content-ideas',
    name: 'Content Ideas',
    description: 'Creative concepts for future content creation'
  }
];

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [deletingCollectionId, setDeletingCollectionId] = useState<string | null>(null);
  
  // Check for pending note from content plan or other sources
  useEffect(() => {
    const pendingNoteData = localStorage.getItem('pendingNote');
    if (pendingNoteData) {
      try {
        const noteData = JSON.parse(pendingNoteData);
        
        // Create new note with proper structure
        const newNote: Note = {
          id: `note-${Date.now()}`,
          title: noteData.title || 'Untitled Note',
          content: noteData.content || '',
          color: noteData.color || 'yellow',
          collectionId: noteData.collectionId,
          createdAt: new Date()
        };
        
        // Add to the beginning of notes array
        setNotes(prevNotes => [newNote, ...prevNotes]);
        
        // Clear pending note from localStorage
        localStorage.removeItem('pendingNote');
        
        // Show success message
        toast({
          title: "Note saved successfully!",
          description: `"${newNote.title}" has been added to your notes.`,
        });
        
      } catch (error) {
        console.error('Error parsing pending note:', error);
        localStorage.removeItem('pendingNote');
        
        toast({
          title: "Error saving note",
          description: "There was an issue saving your note. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, []);
  
  // Add a new note
  const handleAddNote = (noteData: AddNoteData, activeCollectionId?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      ...noteData,
      collectionId: activeCollectionId || noteData.collectionId,
      createdAt: new Date()
    };
    
    setNotes(prevNotes => [newNote, ...prevNotes]);
    
    toast({
      title: "Note created!",
      description: "Your new note has been added.",
    });
  };
  
  // Add a new collection
  const handleAddCollection = (collectionData: AddCollectionData) => {
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      ...collectionData
    };
    
    setCollections(prevCollections => [...prevCollections, newCollection]);
    
    toast({
      title: "Collection created!",
      description: `Collection "${newCollection.name}" has been created.`,
    });
  };
  
  // Update a note
  const handleUpdateNote = (id: string, updates: UpdateNoteData) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, ...updates }
          : note
      )
    );
    setEditingNote(null);
    
    toast({
      title: "Note updated!",
      description: "Your changes have been saved.",
    });
  };
  
  // Delete a note
  const handleDeleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    setDeletingNoteId(null);
    
    toast({
      title: "Note deleted",
      description: `"${noteToDelete?.title || 'Note'}" has been permanently removed.`
    });
  };
  
  // Delete a collection and its notes
  const handleDeleteCollection = (id: string) => {
    const collectionToDelete = collections.find(collection => collection.id === id);
    
    setCollections(prevCollections => 
      prevCollections.filter(collection => collection.id !== id)
    );
    
    // Move notes from this collection back to uncategorized
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.collectionId === id
          ? { ...note, collectionId: undefined }
          : note
      )
    );
    
    setDeletingCollectionId(null);
    
    toast({
      title: "Collection deleted",
      description: `"${collectionToDelete?.name || 'Collection'}" has been removed. All notes have been moved to Uncategorized.`
    });
  };

  return {
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
  };
};
