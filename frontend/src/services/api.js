import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);
export const getMe = () => API.get('/auth/me');

// Leave APIs
export const applyLeave = (leaveData) => API.post('/leaves', leaveData);
export const getMyRequests = () => API.get('/leaves/my-requests');
export const cancelRequest = (id) => API.delete(`/leaves/${id}`);
export const getBalance = () => API.get('/leaves/balance');

// Manager APIs
export const getAllRequests = () => API.get('/leaves/all');
export const getPendingRequests = () => API.get('/leaves/pending');
export const approveLeave = (id, comment) =>
  API.put(`/leaves/${id}/approve`, { managerComment: comment });
export const rejectLeave = (id, comment) =>
  API.put(`/leaves/${id}/reject`, { managerComment: comment });

// Dashboard APIs
export const getEmployeeStats = () => API.get('/dashboard/employee');
export const getManagerStats = () => API.get('/dashboard/manager');

export default API;