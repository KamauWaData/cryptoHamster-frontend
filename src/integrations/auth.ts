import { apiClient } from './client';

// Login function
export const login = async (username: string, password: string) => {
    try{
        const response = await apiClient.post('token/', {username, password});
        const { access, refresh } = response.data;

        // save tokens to localStorage
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        return response.data;
    } catch (error: any) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const accessToken = localStorage.getItem('access_token'); // Retrieve the token from localStorage

  try {
    const response = await apiClient.post('/upload/', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Include the token in the Authorization header
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('File uploaded successfully:', response.data);
    return response.data; // Return the response for further use
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Rethrow the error for the caller to handle
  }
};
// Refresh token function
export const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      console.warn('No refresh token found');
      throw new Error('No refresh token found');
    }
  
    try {
      const response = await apiClient.post('/token/refresh/', { refresh });
      const { access } = response.data;
  
      localStorage.setItem('access_token', access);
      return access;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      throw error;
    }
  };

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('Logged out successfully');
};

