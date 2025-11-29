import axios from 'axios';

// Create a dedicated instance for PDF operations
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/pdf',
  withCredentials: true, // Send cookies (JWT) with request
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