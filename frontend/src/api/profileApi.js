import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/profile',
  withCredentials: true,
});

export const getProfile = async () => {
  const response = await api.get('/');
  return response.data;
};