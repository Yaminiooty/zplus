import { createAsyncThunk } from '@reduxjs/toolkit';
import toolsDashboardService from '../../api/services/toolsDashboardService';

const toolsDashboardThunk = {
  getTools: createAsyncThunk('/getTools', async (_, { rejectWithValue }) => {
    try {
      const response = await toolsDashboardService.getTools();
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
  sendSelectedTools: createAsyncThunk('/sendSelectedTools', async (selectedToolsData, { rejectWithValue }) => {
    try {
      const response = await toolsDashboardService.sendSelectedTools(selectedToolsData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
};

export default toolsDashboardThunk;
