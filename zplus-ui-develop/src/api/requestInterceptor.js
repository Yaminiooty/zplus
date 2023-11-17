const requestInterceptor = async (config) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!config.headers.Authorization && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

const requestErrorInterceptor = (error) => {
  return Promise.reject(error);
};

export { requestInterceptor, requestErrorInterceptor };
