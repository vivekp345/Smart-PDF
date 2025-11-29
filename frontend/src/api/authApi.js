import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/auth',
  withCredentials: true, // IMPORTANT: Allows cookies to be sent/received
  headers: {
    'Content-Type': 'application/json',
  },
});

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