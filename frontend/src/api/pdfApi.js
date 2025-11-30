import axios from 'axios';

// Create a dedicated instance for PDF operations
// Example for authApi.js
const api = axios.create({
  // If we are in production, use the environment variable. Otherwise, localhost.
  baseURL: import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`
    : 'http://localhost:5000/api/v1/auth',
  withCredentials: true,
  // ... rest of config
});
export const summarizePdf = async (file, language) => {
  // 1. Create FormData object
  const formData = new FormData();
  formData.append('pdf', file);      // Matches backend: upload.single('pdf')
  formData.append('language', language);

  // 2. Send POST request
  const response = await api.post('/summarize', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Required for files
    },
  });

  return response.data; // Returns the Summary object from DB
};