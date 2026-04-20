import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { Url } from '../../../config';
import { LoginPayload, SignUpPayload } from '../../types/notes.types';

export const createSignUpUsers = createAsyncThunk(
  'authSlice/signUpUsers',
  async (payload: SignUpPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Url}/auth/signup`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || 'Signup failed');
    }
  },
);

export const createLoginUser = createAsyncThunk(
  'authSlice/loginUsers',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Url}/auth/login`, payload);
      if (response.data.data) {
        const token = response.data.data.token;
        if (token) {
          await Keychain.setGenericPassword('userToken', token);
        }
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error || 'Login failed');
    }
  },
);

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    signUpData: [],
    loginData: [],
    status: 'idle',
    isLoggedIn: false,
  },
  reducers: {
    logout: state => {
      state.isLoggedIn = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createSignUpUsers.pending, state => {
        state.status = 'loading';
      })
      .addCase(createSignUpUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.signUpData = action.payload;
      })
      .addCase(createSignUpUsers.rejected, state => {
        state.status = 'failed';
      })

      .addCase(createLoginUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(createLoginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loginData = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(createLoginUser.rejected, state => {
        state.status = 'failed';
        state.isLoggedIn = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
