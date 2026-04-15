import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Payload } from '../../screens/SignUp';

export const fetchNotes = createAsyncThunk(
  'noteDetailsSlice/fetchUsers',
  async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/notes`);
      console.log(response, 'response==============');
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

const noteSlice = createSlice({
  name: 'noteDetailsSlice',
  initialState: { data: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNotes.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = 'failed';
        // state = action.payload;
      });
  },
});

export default noteSlice.reducer;
