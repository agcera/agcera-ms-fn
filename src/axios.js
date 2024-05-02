import axios from 'axios';
import { BACKEND_API } from './constants';

const axiosInstance = axios.create({
  baseURL: BACKEND_API,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // redirect to login page
      axiosInstance.post('/users/logout');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
