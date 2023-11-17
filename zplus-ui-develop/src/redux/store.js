import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import userReducer from '../redux/slices/userSlice';
import toolsDashboardReducer from '../redux/slices/toolsDashboardSlice';
import toolsConfigReducer from '../redux/slices/toolsConfigSlice';
import actionPipelineReducer from '../redux/slices/actionPipelineSlice';
import reportReducer from '../redux/slices/reportsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    toolsDashboard: toolsDashboardReducer,
    toolsConfig: toolsConfigReducer,
    actionPipeline: actionPipelineReducer,
    reports: reportReducer,
  },
});

export default store;
