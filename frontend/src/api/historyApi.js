import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/history` // <--- MUST SAY /history
    : 'http://localhost:5000/api/v1/history',
  withCredentials: true,
});

export const fetchHistory = async () => {
  const response = await api.get('/');
  return response.data;
};

export const deleteHistoryItem = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export default api;