import axios from 'axios';

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    let rawUrl = envUrl.trim().replace(/\/+$/, '');
    if (!rawUrl.endsWith('/api')) {
      rawUrl += '/api';
    }
    return rawUrl;
  }

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';

  // If local development, default to port 5001
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return `http://${currentHost}:5001/api`;
  }

  // In production without explicit VITE_API_URL, fallback to domain /api
  return `${protocol}//${currentHost}/api`;
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
