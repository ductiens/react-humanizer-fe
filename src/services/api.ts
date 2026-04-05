import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and force reload to login
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const humanizeService = {
  // Main humanize stream function is handled in useHumanize hook natively with fetch
  
  // Upload file to parse text (PDF/DOCX)
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/parse-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get history
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },

  // Download DOCX
  downloadDocx: async (historyId: string, filename: string = 'humanized.docx') => {
    try {
      const response = await api.get(`/history/${historyId}/export`, {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document', error);
      throw error;
    }
  },

  // Auth
  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Analysis
  getAIScore: async (text: string) => {
    const response = await api.post('/analyze/ai-score', { text });
    return response.data;
  },
  getAIPhrases: async (text: string) => {
    const response = await api.post('/analyze/phrases', { text });
    return response.data;
  }
};
