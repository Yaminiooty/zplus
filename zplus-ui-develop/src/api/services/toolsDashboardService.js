import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';
import { BACKEND_ENDPOINT } from '../backend_endpoints';

const toolsDashboardService = {
  getTools: async () => {
    try {
      const response = await axiosInstance.get(BACKEND_ENDPOINT.GET_TOOLS);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
  sendSelectedTools: async (selectedToolsData) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.SEND_SELECTED_TOOLS, selectedToolsData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
};

export default toolsDashboardService;
