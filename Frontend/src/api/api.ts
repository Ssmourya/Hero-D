import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in every request
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.token) {
        // Add the token to the Authorization header
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ledger API
export const ledgerApi = {
  getAll: () => api.get('/ledger'),
  getById: (id: string) => api.get(`/ledger/${id}`),
  create: (data: any) => api.post('/ledger', data),
  update: (id: string, data: any) => api.put(`/ledger/${id}`, data),
  delete: (id: string) => api.delete(`/ledger/${id}`),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Vehicles API
export const vehiclesApi = {
  getAll: () => api.get('/vehicles'),
  getById: (id: string) => api.get(`/vehicles/${id}`),
  create: (data: any) => api.post('/vehicles', data),
  update: (id: string, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: string) => api.delete(`/vehicles/${id}`),
};

// Workshop API
export const workshopApi = {
  getAll: () => api.get('/workshop'),
  getById: (id: string) => api.get(`/workshop/${id}`),
  create: (data: any) => api.post('/workshop', data),
  update: (id: string, data: any) => api.put(`/workshop/${id}`, data),
  delete: (id: string) => api.delete(`/workshop/${id}`),
};

export default api;
