import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';
import { BACKEND_ENDPOINT } from '../backend_endpoints';

const userService = {
  getUserDetails: async () => {
    try {
      const response = await axiosInstance.get(BACKEND_ENDPOINT.GET_USER_DETAILS);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
  updateUserDetails: async (updatedData) => {
    try {
      const response = await axiosInstance.patch(BACKEND_ENDPOINT.UPDATE_USER_DETAILS, updatedData);
      toast.success('User details updated.');
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
  changePassword: async (data) => {
    try {
      const response = await axiosInstance.patch(BACKEND_ENDPOINT.CHANGE_PASSWORD, data);
      toast.success('Password updated.');
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },
};

export default userService;
