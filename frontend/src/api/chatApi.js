import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat` // <--- MUST SAY /chat
    : 'http://localhost:5000/api/v1/chat',
  withCredentials: true,
});

export const sendMessageToAi = async (message, history) => {
  const response = await api.post('/', { message, history });
  return response.data;
};

export default api;