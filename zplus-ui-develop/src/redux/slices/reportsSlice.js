import { createAction, createSlice } from '@reduxjs/toolkit';
import reportsThunk from '../thunks/reportsThunk';

export const resetReportStates = createAction('report/reset');

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    isReportFetching: false,
    isReportFetched: false,
    reportData: null,
    reportFile: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(reportsThunk.getReports.pending, (state) => {
        state.isReportFetching = true;
        state.isReportFetched = false;
      })
      .addCase(reportsThunk.getReports.fulfilled, (state, action) => {
        state.isReportFetching = false;
        state.isReportFetched = true;
        state.reportData = action.payload?.json;
        state.reportFile = action.payload?.report_files;
      })
      .addCase(reportsThunk.getReports.rejected, (state) => {
        state.isReportFetching = false;
        state.isReportFetched = false;
      });
    builder.addCase(resetReportStates, (state) => {
      state.isReportFetched = false;
      state.isReportFetching = false;
      state.reportData = null;
      state.reportFile = null;
    });
  },
});

export default reportSlice.reducer;
