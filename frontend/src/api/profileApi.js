import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile` // <--- MUST SAY /profile
    : 'http://localhost:5000/api/v1/profile',
  withCredentials: true,
});

export const getProfile = async () => {
  const response = await api.get('/');
  return response.data;
};

export default api;