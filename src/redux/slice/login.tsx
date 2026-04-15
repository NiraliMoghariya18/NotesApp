import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LoginPayload } from '../../screens/Login';

export const fetchLoginUser = createAsyncThunk(
  'loginSlice/fetchUsers',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/login`,
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
  name: 'loginSlice',
  initialState: { data: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLoginUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLoginUser.rejected, state => {
        state.status = 'failed';
      });
  },
});

export default loginSlice.reducer;
