import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/pdf` // <--- MUST SAY /pdf
    : 'http://localhost:5000/api/v1/pdf',
  withCredentials: true,
});

export const summarizePdf = async (file, language) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('language', language);

  const response = await api.post('/summarize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export default api;