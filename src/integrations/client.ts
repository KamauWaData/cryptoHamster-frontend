import axios from 'axios';
import { refreshToken } from './auth';

// Base URL for your Django API
const DJANGO_API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/';

// Create an Axios instance for your Django API
export const apiClient = axios.create({
  baseURL: DJANGO_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example usage:
// apiClient.get('articles/').then(response => console.log(response.data));

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken && config.url?.startsWith('/admin/')) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log('Authorization Header:', config.headers.Authorization); // Debugging
  } else if(config.url?.startsWith('/admin/')) {
    console.warn('No access token found in localStorage');
  }
  return config;
});


//add an interceptor to include the access token in request
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token and the endpoint requires authentication
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.headers.Authorization) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //check if the error is due to an expired token
    if (error.response?.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = 'Bearer ${newAccessToken}';
        return apiClient(originalRequest); //retry the original request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw refreshError;
      }  
      }
      return Promise.reject(error);
  }
)


