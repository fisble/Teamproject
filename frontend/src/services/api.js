import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const registerAdmin = (data) => api.post('/auth/admin/register', data);
export const loginAdmin = (data) => api.post('/auth/admin/login', data);

// User endpoints
export const analyzeResume = (formData) => api.post('/analyze', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const getHistory = () => api.get('/history');

// Admin endpoints
export const adminGetDashboardStats = () => api.get('/admin/dashboard/stats');
export const adminGetAllUsers = () => api.get('/admin/users');
export const adminGetUserReports = (userId) => api.get(`/admin/users/${userId}/reports`);
export const adminGetAllReports = () => api.get('/admin/reports');
export const adminSearchUsers = (query) => api.get('/admin/users/search', { params: { query } });

export default api;

