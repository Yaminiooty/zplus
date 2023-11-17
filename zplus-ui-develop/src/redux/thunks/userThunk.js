import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../api/services/userService';

const userThunk = {
  getUserDetails: createAsyncThunk('/getUserDetails', async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserDetails();
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
  updateUserDetails: createAsyncThunk('/updateUserDetails', async (updatedData, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserDetails(updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
  changePassword: createAsyncThunk('/changePassword', async (data, { rejectWithValue }) => {
    try {
      const response = await userService.changePassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
};

export default userThunk;
