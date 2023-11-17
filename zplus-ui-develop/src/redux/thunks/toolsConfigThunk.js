import { createAsyncThunk } from '@reduxjs/toolkit';
import toolsConfigService from '../../api/services/toolsConfigService';

const toolsConfigThunk = {
  saveToolsConfig: createAsyncThunk('/saveToolsConfig', async ({ toolName, formData }, { rejectWithValue }) => {
    try {
      const response = await toolsConfigService.saveToolsConfig(toolName, formData);
      return response;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
  getMetasploitModules: createAsyncThunk('/getMetasploitModules', async (module_type, { rejectWithValue }) => {
    try {
      const response = await toolsConfigService.getMetasploitModules(module_type);
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
  getMetasploitModulesOptions: createAsyncThunk(
    '/getMetasploitModulesOptions',
    async (searchParams, { rejectWithValue }) => {
      try {
        const response = await toolsConfigService.getMetasploitModulesOptions(searchParams);
        return response.data;
      } catch (error) {
        return rejectWithValue('Opps there seems to be an error.');
      }
    }
  ),
  getToolsConfig: createAsyncThunk('/getToolsConfig', async (_, { rejectWithValue }) => {
    try {
      const response = await toolsConfigService.getToolsConfig();
      return response.data;
    } catch (error) {
      return rejectWithValue('Opps there seems to be an error.');
    }
  }),
};

export default toolsConfigThunk;
