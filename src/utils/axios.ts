import axios, { AxiosError, AxiosInstance } from 'axios';
import { BASE_URL } from './constants';

export const apiFetcher: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // This ensures credentials are included with every request
});

apiFetcher.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      window.location.href = `${BASE_URL}/auth/google`;
    }
    return Promise.reject(error);
  }
);
