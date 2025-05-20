import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:8081/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
