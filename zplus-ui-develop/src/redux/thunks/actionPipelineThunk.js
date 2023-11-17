import { createAsyncThunk } from '@reduxjs/toolkit';
import actionPipelineService from '../../api/services/actionPipelineServices';

const actionPipelineThunk = {
  createPipeline: createAsyncThunk('/createPipeline', async (_, { rejectWithValue }) => {
    try {
      const response = await actionPipelineService.createPipeline();
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
  runPipeline: createAsyncThunk('/runPipeline', async (pipelineID, { rejectWithValue }) => {
    try {
      const response = await actionPipelineService.runPipeline(pipelineID);
      return response;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
  getPipelineStatus: createAsyncThunk('/pipelineStatus', async (pipelineID, { rejectWithValue }) => {
    try {
      const response = await actionPipelineService.getPipelineStatus(pipelineID);
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
};

export default actionPipelineThunk;
