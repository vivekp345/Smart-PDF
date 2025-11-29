import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/chat',
  withCredentials: true,
});

export const sendMessageToAi = async (message, history) => {
  const response = await api.post('/', { message, history });
  return response.data;
};