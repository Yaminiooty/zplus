import { createAction, createSlice } from '@reduxjs/toolkit';
import toolsDashboardThunk from '../thunks/toolsDashboardThunk';

export const resetToolsDashboard = createAction('toolsDashboard/reset');
export const resetToolsData = createAction('toolsData/reset');

const toolsDashboardSlice = createSlice({
  name: 'toolsDashboard',
  initialState: {
    selectedTools: [],
    selectedToolsIDs: [],
    isToolsFetching: false,
    isToolsFetched: false,
    tools: null,
  },
  reducers: {
    selectTool: (state, action) => {
      if (!state.selectedTools.includes(action.payload)) {
        state.selectedTools = [...state.selectedTools, action.payload];
      }
    },
    deselectTool: (state, action) => {
      state.selectedTools = state.selectedTools.filter((tool) => tool !== action.payload);
    },
    selectToolID: (state, action) => {
      if (!state.selectedTools.includes(action.payload)) {
        state.selectedToolsIDs = [...state.selectedToolsIDs, action.payload];
      }
    },
    deselectToolID: (state, action) => {
      state.selectedToolsIDs = state.selectedToolsIDs.filter((tool) => tool !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toolsDashboardThunk.getTools.pending, (state) => {
        state.isToolsFetching = true;
        state.isToolsFetched = false;
      })
      .addCase(toolsDashboardThunk.getTools.fulfilled, (state, action) => {
        state.isToolsFetching = false;
        state.isToolsFetched = true;
        state.tools = action.payload;
      })
      .addCase(toolsDashboardThunk.getTools.rejected, (state) => {
        state.isToolsFetching = false;
        state.isToolsFetched = false;
      });
    builder.addCase(resetToolsDashboard, (state) => {
      state.selectedTools = [];
      state.selectedToolsIDs = [];
      state.isToolsFetching = false;
      state.isToolsFetched = false;
    });
    builder.addCase(resetToolsData, (state) => {
      state.tools = null;
    });
  },
});

export const { selectTool, deselectTool, selectToolID, deselectToolID } = toolsDashboardSlice.actions;

export default toolsDashboardSlice.reducer;
