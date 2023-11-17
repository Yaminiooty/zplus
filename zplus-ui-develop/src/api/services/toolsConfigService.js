import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';
import { BACKEND_ENDPOINT } from '../backend_endpoints';

const toolsConfigService = {
  saveToolsConfig: async (toolName, formData) => {
    try {
      let contentType = 'application/json';

      if (toolName === 'OWASPDependencyCheck' || toolName === 'JMeterLoadTesting') {
        contentType = 'multipart/form-data';
      }
      const config = {
        headers: {
          'Content-Type': contentType,
        },
      };
      const response = await axiosInstance.post(BACKEND_ENDPOINT.SAVE_TOOL_CONFIGURATION(toolName), formData, config);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
  getMetasploitModules: async (module_type) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.GET_METASPLOIT_MODULES, null, { params: module_type });
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  },
  getMetasploitModulesOptions: async (searchParams) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.GET_METASPLOIT_MODULES_OPTIONS, null, {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  },
  getToolsConfig: async () => {
    try {
      const response = await axiosInstance.get(BACKEND_ENDPOINT.GET_PIPELINE_CONFIGURATION);

      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
};

export default toolsConfigService;
