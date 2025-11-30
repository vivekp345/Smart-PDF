import axios from 'axios';

// Create an Axios instance with default settings
// Example for authApi.js
const api = axios.create({
  // If we are in production, use the environment variable. Otherwise, localhost.
  baseURL: import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`
    : 'http://localhost:5000/api/v1/auth',
  withCredentials: true,
  // ... rest of config
});

export const googleLoginApi = async (token) => {
  const response = await api.post('/google', { token });
  return response.data;
};

export const signup = async (userData) => {
  const response = await api.post('/signup', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/login', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export default api;