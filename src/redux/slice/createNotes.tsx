import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LoginPayload } from '../../screens/Login';

export const createNotes = createAsyncThunk(
  'createNoteSlice/fetchUsers',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/notes`,
        payload,
      );
      console.log(response, 'response');
      return response.data;
    } catch (error) {
      return rejectWithValue(error || 'Signup failed');
    }
  },
);

const loginSlice = createSlice({
  name: 'createNoteSlice',
  initialState: { data: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createNotes.pending, state => {
        state.status = 'loading';
      })
      .addCase(createNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(createNotes.rejected, state => {
        state.status = 'failed';
      });
  },
});

export default loginSlice.reducer;
