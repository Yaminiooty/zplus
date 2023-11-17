import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/services/authServices';

const authThunks = {
  login: createAsyncThunk('/login', async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (response.status === 200) {
        return response.data;
      } else if (response.status === 202) {
        return rejectWithValue(response.status);
      }
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),

  forgotPassword: createAsyncThunk('/forgot_password', async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(credentials);
      return response;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),

  resetPassword: createAsyncThunk('/resetPassword', async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(credentials);
      return response;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),

  registerUser: createAsyncThunk('/registerUser', async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.registerUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),

  verifyAccount: createAsyncThunk('/verifyAccount', async (verificationCode, { rejectWithValue }) => {
    try {
      const response = await authService.verifyAccount(verificationCode);
      return response;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),

  getVerificationCode: createAsyncThunk('/getVerificationCode', async (userEmail, { rejectWithValue }) => {
    try {
      const response = await authService.getVerificationCode(userEmail);
      return response;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),

  logout: createAsyncThunk('/logout', async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
};

export default authThunks;
