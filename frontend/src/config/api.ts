import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const apiBaseUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
