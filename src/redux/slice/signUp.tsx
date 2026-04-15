import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Payload } from '../../screens/SignUp';

// export const fetchSignUpUsers = createAsyncThunk(
//   'users/fetchUsers',
//   async payload => {
//     const response = await axios.post(`${Url}/auth/signup`, { payload });
//     return response.data;
//   },
// );

export const fetchSignUpUsers = createAsyncThunk(
  'signUpSlice/fetchUsers',
  async (payload: Payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/signup`,
        payload,
      );
      console.log(response, 'response');
      return response.data;
    } catch (error) {
      return rejectWithValue(error || 'Signup failed');
    }
  },
);

const signUpSlice = createSlice({
  name: 'signUpSlice',
  initialState: { data: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSignUpUsers.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchSignUpUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSignUpUsers.rejected, (state, action) => {
        state.status = 'failed';
        // state = action.payload;
      });
  },
});

export default signUpSlice.reducer;
