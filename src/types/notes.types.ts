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
  id?: string;
  description: string;
  title: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  source: string;
  isOffline?: boolean;
}

export interface NotesState {
  fetchNotesData: Note[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  offlineData: Note[];
}

export interface UpdatedData {
  description: string;
  title: string;
}
