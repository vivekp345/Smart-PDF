import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/history',
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