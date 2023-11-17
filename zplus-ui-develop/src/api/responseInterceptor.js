import axios from 'axios';
import axiosInstance from './axiosInstance';
import { BACKEND_ENDPOINT } from './backend_endpoints';

const responseInterceptor = (response) => {
  return response;
};

const responseErrorInterceptor = async (error) => {
  const originalConfig = error.config;
  // Access Token was expired
  if (error?.response?.status === 401 && !originalConfig._retry) {
    originalConfig._retry = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.get(`${BACKEND_ENDPOINT.ACCESS_TOKEN}`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const access_token = response.data.data.access_token;
      localStorage.setItem('accessToken', access_token);

      originalConfig.headers.Authorization = `Bearer ${access_token}`;
      return axiosInstance(originalConfig);
    } catch (error) {
      //Handle refresh token error or redirects to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      redirectToLogin();
    }
  }

  return Promise.reject(error);
};

function redirectToLogin() {
  window.location.href = '/';
}

export { responseInterceptor, responseErrorInterceptor };
