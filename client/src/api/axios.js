import axios from 'axios';

const getApiBaseUrl = () => {
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const defaultBaseUrl = `http://${currentHost}:5001/api`;
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  
  let rawUrl = (envUrl && envUrl.trim()) ? envUrl.trim() : defaultBaseUrl;
  
  // Remove all trailing slashes
  rawUrl = rawUrl.replace(/\/+$/, '');

  // Guarantee ending with exactly /api (without duplicating /api/api)
  if (!rawUrl.endsWith('/api')) {
    rawUrl += '/api';
  }

  return rawUrl;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000, // 10s fetch timeout for production reliability
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mailmind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mailmind_token');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
