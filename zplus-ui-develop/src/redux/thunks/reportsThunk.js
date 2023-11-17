import { createAsyncThunk } from '@reduxjs/toolkit';
import reportsService from '../../api/services/reportsService';

const reportsThunk = {
  getReports: createAsyncThunk('/getReports', async (data, { rejectWithValue }) => {
    try {
      const response = await reportsService.getReports(data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
};

export default reportsThunk;
