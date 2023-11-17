import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';
import { BACKEND_ENDPOINT } from '../backend_endpoints';

const reportsService = {
  getReports: async (data) => {
    try {
      const response = await axiosInstance.get(BACKEND_ENDPOINT.GET_REPORTS, { params: data });
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
  emailReport: async (data) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.EMAIL_REPORT, data);
      toast.success('Report send to registered email address.');
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
  downloadReport: async (data) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.DOWNLOAD_REPORT, data);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
};

export default reportsService;
