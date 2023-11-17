import { createAction, createSlice } from '@reduxjs/toolkit';
import toolsConfigThunk from '../thunks/toolsConfigThunk';

export const resetToolsConfig = createAction('toolsConfig/reset');
export const resetSaveConfigStates = createAction('saveConfig/reset');
export const resetPipelineDataStates = createAction('pipelineData/reset');

const toolsConfigSlice = createSlice({
  name: 'toolsConfig',
  initialState: {
    nmapConfig: null,
    isMetasploitModules: false,
    metasploitModules: null,
    isMetasploitModulesOptions: false,
    metasploitModulesOptions: null,
    metasploitConfig: null,
    owaspZapConfig: null,
    owaspDependencyCheckConfig: null,
    openVASConfig: null,
    sqlMapConfig: null,
    jmeterConfig: null,
    selectedFiles: [],
    isConfigSaving: false,
    isConfigSaved: false,
    isConfigFetching: false,
    isConfigFetched: false,
    toolsConfigData: null,
  },

  reducers: {
    updateNmapConfig: (state, action) => {
      state.nmapConfig = action.payload;
    },
    updateMetasploitConfig: (state, action) => {
      state.metasploitConfig = action.payload;
    },
    updateOWASPZapConfig: (state, action) => {
      state.owaspZapConfig = action.payload;
    },
    updateOWASPDependencyCheckConfig: (state, action) => {
      state.owaspDependencyCheckConfig = action.payload;
    },
    updateOpenVASConfig: (state, action) => {
      state.openVASConfig = action.payload;
    },
    updateSQLMapConfig: (state, action) => {
      state.sqlMapConfig = action.payload;
    },
    updateJMeterConfig: (state, action) => {
      state.jmeterConfig = action.payload;
    },
    setFile: (state, action) => {
      const { fieldName, fileName } = action.payload;
      state[fieldName] = fileName;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(toolsConfigThunk.saveToolsConfig.pending, (state) => {
        state.isConfigSaving = true;
        state.isConfigSaved = false;
      })
      .addCase(toolsConfigThunk.saveToolsConfig.fulfilled, (state) => {
        state.isConfigSaving = false;
        state.isConfigSaved = true;
      })
      .addCase(toolsConfigThunk.saveToolsConfig.rejected, (state) => {
        state.isConfigSaving = false;
        state.isConfigSaved = false;
      });
    builder
      .addCase(toolsConfigThunk.getToolsConfig.pending, (state) => {
        state.isConfigFetching = true;
        state.isConfigFetched = false;
      })
      .addCase(toolsConfigThunk.getToolsConfig.fulfilled, (state, action) => {
        state.isConfigFetching = false;
        state.isConfigFetched = true;
        state.toolsConfigData = action.payload;
      })
      .addCase(toolsConfigThunk.getToolsConfig.rejected, (state) => {
        state.isConfigFetching = false;
        state.isConfigFetched = false;
      });
    builder
      .addCase(toolsConfigThunk.getMetasploitModules.pending, (state) => {
        state.isMetasploitModules = false;
      })
      .addCase(toolsConfigThunk.getMetasploitModules.fulfilled, (state, action) => {
        state.isMetasploitModules = true;
        state.metasploitModules = action.payload?.map((item) => {
          return { value: item.fullname, label: item.name };
        });
      })
      .addCase(toolsConfigThunk.getMetasploitModules.rejected, (state) => {
        state.isMetasploitModules = false;
      });
    builder
      .addCase(toolsConfigThunk.getMetasploitModulesOptions.pending, (state) => {
        state.isMetasploitModulesOptions = false;
      })
      .addCase(toolsConfigThunk.getMetasploitModulesOptions.fulfilled, (state, action) => {
        state.isMetasploitModulesOptions = true;
        state.metasploitModulesOptions = Object.keys(action.payload).map((key, index) => ({
          id: index,
          name: key,
          ...action.payload[key],
        }));
      })
      .addCase(toolsConfigThunk.getMetasploitModulesOptions.rejected, (state) => {
        state.isMetasploitModulesOptions = false;
      });
    builder.addCase(resetSaveConfigStates, (state) => {
      state.isConfigSaved = false;
      state.isConfigSaving = false;
    });
    builder.addCase(resetToolsConfig, (state) => {
      state.nmapConfig = null;
      state.isMetasploitModules = false;
      state.metasploitModules = null;
      state.isMetasploitModulesOptions = false;
      state.metasploitModulesOptions = null;
      state.metasploitConfig = null;
      state.owaspZapConfig = null;
      state.owaspDependencyCheckConfig = null;
      state.openVASConfig = null;
      state.sqlMapConfig = null;
      state.jmeterConfig = null;
      state.selectedFiles = [];
    });
    builder.addCase(resetPipelineDataStates, (state) => {
      state.isConfigFetching = false;
      state.isConfigFetched = false;
      state.toolsConfigData = null;
    });
  },
});

export const {
  updateNmapConfig,
  updateMetasploitConfig,
  updateOWASPZapConfig,
  updateOWASPDependencyCheckConfig,
  updateOpenVASConfig,
  updateSQLMapConfig,
  updateJMeterConfig,
  setFile,
  removeToolsConfig,
} = toolsConfigSlice.actions;

export default toolsConfigSlice.reducer;
