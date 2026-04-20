export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateNotesPayload {
  description: string;
  title: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesState {
  fetchNotesData: Note[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export interface UpdatedData {
  description: string;
  title: string;
}
