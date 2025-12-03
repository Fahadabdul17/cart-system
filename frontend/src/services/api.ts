import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// basic response interceptor
api.interceptors.response.use(
  res => res,
  err => {
    // You can centralize error handling here (toast, logging)
    return Promise.reject(err);
  }
);

export default api;
