import axios from 'axios';
import { requestErrorInterceptor, requestInterceptor } from './requestInterceptor';
import { responseErrorInterceptor, responseInterceptor } from './responseInterceptor';

const axiosInstance = axios.create({});

//Request Interceptor
axiosInstance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

//Response Interceptor
axiosInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default axiosInstance;
