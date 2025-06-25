
export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  collectionId?: string;
  createdAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
}

export interface AddNoteData {
  title: string;
  content: string;
  color: string;
  collectionId?: string;
}

export interface AddCollectionData {
  name: string;
  description: string;
}

export interface UpdateNoteData {
  title: string;
  content: string;
  color: string;
  collectionId?: string;
}
