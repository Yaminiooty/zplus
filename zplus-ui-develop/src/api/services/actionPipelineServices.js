import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';
import { BACKEND_ENDPOINT } from '../backend_endpoints';

const actionPipelineService = {
  createPipeline: async () => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.CREATE_PIPELINE);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
  runPipeline: async (pipelineID) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.RUN_PIPELINE, null, { params: pipelineID });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
  getPipelineStatus: async (pipelineID) => {
    try {
      const response = await axiosInstance.get(BACKEND_ENDPOINT.GET_PIPELINE_STATUS(pipelineID));
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
};

export default actionPipelineService;
