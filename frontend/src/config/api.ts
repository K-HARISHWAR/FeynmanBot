import axios from 'axios';
import { supabase } from './supabaseClient';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const apiBaseUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    // We could emit an event here to trigger a logout or redirect
    console.error('Unauthorized request - 401');
  }
  return Promise.reject(error);
});
