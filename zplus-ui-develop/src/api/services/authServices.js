import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';
import { BACKEND_ENDPOINT } from '../backend_endpoints';

const authService = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.LOGIN, credentials);

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.data.access_token);
        localStorage.setItem('refreshToken', response.data.data.refresh_token);
      } else if (response.status === 202) {
        toast.error(response.data.message);
      }
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  },

  forgotPassword: async (credentials) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.FORGOT_PASSWORD, credentials);

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  },

  resetPassword: async (credentials) => {
    try {
      const response = await axiosInstance.patch(BACKEND_ENDPOINT.RESET_PASSWORD, credentials);

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(`${error.response.data.message}\nReset password link expired.`);
      throw error;
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.REGISTER_USER, userData);

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  },

  verifyAccount: async (verificationCode) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.VERIFY_ACCOUNT, verificationCode);

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  },

  getVerificationCode: async (userEmail) => {
    try {
      const response = await axiosInstance.post(BACKEND_ENDPOINT.GET_VERIFICATION_CODE, userEmail);

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.get(BACKEND_ENDPOINT.LOGOUT);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
};

export default authService;
