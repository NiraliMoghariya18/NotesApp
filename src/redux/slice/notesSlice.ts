import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { Url } from '../../../config';
import {
  CreateNotesPayload,
  Note,
  NotesState,
  UpdatedData,
} from '../../types/notes.types';

export const createNotes = createAsyncThunk(
  'notesSlice/createNotes',
  async (payload: CreateNotesPayload, { rejectWithValue }) => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        return rejectWithValue('No token found');
      }

      const token = credentials.password;
      const response = await axios.post(`${Url}/notes`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error || 'Failed to fetch notes');
    }
  },
);

export const fetchNotes = createAsyncThunk(
  'notesSlice/fetchNotes',
  async (_, { rejectWithValue }) => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        return rejectWithValue('No token found');
      }

      const token = credentials.password;
      const response = await axios.get(`${Url}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error || 'Failed to fetch notes');
    }
  },
);

export const deleteNotes = createAsyncThunk(
  'notesSlice/deleteNotes',
  async (id: string, { rejectWithValue }) => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        return rejectWithValue('No token found');
      }
      const token = credentials.password;
      await axios.delete(`${Url}/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error || 'Failed to delete note');
    }
  },
);
export const updateNotes = createAsyncThunk(
  'notesSlice/updateNotes',
  async (
    { id, data }: { id: string; data: UpdatedData },
    { rejectWithValue },
  ) => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) return rejectWithValue('No token found');
      const token = credentials.password;

      const response = await axios.put(`${Url}/notes/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error || 'Failed to update note');
    }
  },
);

export const syncOfflineNotes = createAsyncThunk(
  'notesSlice/syncOfflineNotes',
  async (_, { getState, dispatch }) => {
    const state = getState() as { notesSlice: NotesState };
    const offlineNotes = state.notesSlice.offlineData;

    const failedNotes: Note[] = [];

    for (const note of offlineNotes) {
      try {
        if (note.title === '1234') {
          throw new Error('Simulated Fail');
        }
        await dispatch(createNotes(note)).unwrap();
      } catch (error) {
        failedNotes.push(note);
      }
    }
    return failedNotes;
  },
);

const initialState: NotesState = {
  fetchNotesData: [],
  status: 'idle',
  offlineData: [],
};
const notesSlice = createSlice({
  name: 'notesSlice',
  initialState,
  reducers: {
    addOfflineNote: (state, action: PayloadAction<CreateNotesPayload>) => {
      const tempNote = {
        ...action.payload,
        id: Date.now().toString(),
        isOffline: true,
      };

      state.offlineData.push(tempNote as Note);
    },
    updateOfflineNote: (
      state,
      action: PayloadAction<{ id: string; data: CreateNotesPayload }>,
    ) => {
      if (!state.offlineData) return;
      state.offlineData = state.offlineData.map(item =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.data }
          : item,
      );
    },
    deleteOfflineNote: (state, action: PayloadAction<string>) => {
      state.offlineData = state.offlineData.filter(
        note => note.id !== action.payload,
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createNotes.pending, state => {
        state.status = 'loading';
      })
      .addCase(createNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.fetchNotesData = [action.payload, ...state.fetchNotesData];
      })
      .addCase(createNotes.rejected, state => {
        state.status = 'failed';
      })

      .addCase(fetchNotes.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.fetchNotesData = action.payload.data;
      })
      .addCase(fetchNotes.rejected, state => {
        state.status = 'failed';
      })

      .addCase(deleteNotes.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteNotes.fulfilled, (state, action) => {
        state.fetchNotesData = state.fetchNotesData.filter(
          note => note.id !== action.payload,
        );
        state.status = 'succeeded';
      })
      .addCase(deleteNotes.rejected, state => {
        state.status = 'failed';
      })

      .addCase(updateNotes.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateNotes.fulfilled, (state, action) => {
        state.fetchNotesData = state.fetchNotesData.map(item =>
          item.id === action.payload.data.id ? action.payload.data : item,
        );
        state.status = 'succeeded';
      })
      .addCase(updateNotes.rejected, state => {
        state.status = 'failed';
      })

      .addCase(syncOfflineNotes.pending, state => {
        state.status = 'loading';
      })
      .addCase(syncOfflineNotes.fulfilled, (state, action) => {
        state.offlineData = action.payload;
        state.status = 'succeeded';
      })
      .addCase(syncOfflineNotes.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export default notesSlice.reducer;
export const { addOfflineNote, updateOfflineNote, deleteOfflineNote } =
  notesSlice.actions;
