import axios from 'axios';

// Use environment variable or fallback to localhost - ALWAYS port 8000
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle server errors gracefully
api.interceptors.response.use(
  response => response,
  error => {
    // Handle network errors without crashing the app
    if (!error.response) {
      console.error('Network error or backend server is down:', error.message);
      // You could dispatch a notification here
    }
    return Promise.reject(error);
  }
);

export default api;