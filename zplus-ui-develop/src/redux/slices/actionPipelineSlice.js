import { createAction, createSlice } from '@reduxjs/toolkit';
import actionPipelineThunk from '../thunks/actionPipelineThunk';
import { PIPELINE_STATUS } from '../../utils/constants';

export const resetActionPipeline = createAction('actionPipeline/reset');

const actionPipelineSlice = createSlice({
  name: 'actionPipeline',
  initialState: {
    pipelineID: null,
    isPipielineCreating: false,
    isPipelineCreated: false,
    pipelineStatus: null,
    isPipelineStatusFetched: false,
    isPipelineStarted: false,
    isPipelineCompleted: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionPipelineThunk.createPipeline.pending, (state) => {
        state.isPipielineCreating = true;
        state.isPipelineCreated = false;
      })
      .addCase(actionPipelineThunk.createPipeline.fulfilled, (state, action) => {
        state.isPipielineCreating = false;
        state.isPipelineCreated = true;
        state.pipelineID = action.payload.pipeline_id;
        state.pipelineStatus = action.payload.action_pipeline_status;
      })
      .addCase(actionPipelineThunk.createPipeline.rejected, (state) => {
        state.isPipielineCreating = false;
        state.isPipelineCreated = false;
      });
    builder
      .addCase(actionPipelineThunk.getPipelineStatus.pending, (state) => {
        state.isPipelineStatusFetched = false;
      })
      .addCase(actionPipelineThunk.getPipelineStatus.fulfilled, (state, action) => {
        state.isPipelineStatusFetched = true;
        state.pipelineStatus = action.payload;
        state.isPipelineCompleted = action.payload.every(
          (tool) => tool.status === PIPELINE_STATUS.COMPLETED || tool.status === PIPELINE_STATUS.FAILED
        );
      })
      .addCase(actionPipelineThunk.getPipelineStatus.rejected, (state) => {
        state.isPipelineStatusFetched = false;
      });
    builder
      .addCase(actionPipelineThunk.runPipeline.pending, (state) => {
        state.isPipelineStarted = false;
      })
      .addCase(actionPipelineThunk.runPipeline.fulfilled, (state, action) => {
        state.isPipelineStarted = true;
        state.pipelineStatus = action.payload.data;
      })
      .addCase(actionPipelineThunk.runPipeline.rejected, (state) => {
        state.isPipelineStarted = false;
      });
    builder.addCase(resetActionPipeline, (state) => {
      state.pipelineID = null;
      state.isPipielineCreating = false;
      state.isPipelineCreated = false;
      state.pipelineStatus = null;
      state.isPipelineStatusFetched = false;
      state.isPipelineStarted = false;
      state.isPipelineCompleted = false;
    });
  },
});

export default actionPipelineSlice.reducer;
