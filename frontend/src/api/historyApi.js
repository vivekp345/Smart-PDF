import axios from 'axios';

// Example for authApi.js
const api = axios.create({
  // If we are in production, use the environment variable. Otherwise, localhost.
  baseURL: import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`
    : 'http://localhost:5000/api/v1/auth',
  withCredentials: true,
  // ... rest of config
});

export const fetchHistory = async () => {
  const response = await api.get('/');
  return response.data;
};

export const deleteHistoryItem = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};