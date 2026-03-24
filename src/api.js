import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3005';
// we can use proxy also in package.json file.
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// auth api calls
export async function registerUser(payload) {
  return api.post('/auth/register', payload).then((r) => r.data);
}

export async function loginUser(payload) {
  return api.post('/auth/login', payload).then((r) => r.data);
}


// task api calls
export async function getTasks(params) {
  return api.get('/tasks', { params }).then((r) => r.data);
}

export async function createTask(payload) {
  return api.post('/tasks', payload).then((r) => r.data);
}

export async function updateTask(id, payload) {
  return api.put(`/tasks/${id}`, payload).then((r) => r.data);
}

export async function deleteTask(id) {
  return api.delete(`/tasks/${id}`).then((r) => r.data);
}

export default api;
