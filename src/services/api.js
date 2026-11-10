import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request
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

export const fluidApi = {
  getLogs: (date) => api.get('/fluids', { params: { date } }),
  addLog: (data) => api.post('/fluids', data),
  incrementLog: (id, deltaMl, deltaCalories) => api.put(`/fluids/${id}/increment`, { deltaMl, deltaCalories }),
  deleteLog: (id) => api.delete(`/fluids/${id}`),
  getStats: () => api.get('/fluids/stats'),
  getCalendar: (year, month) => api.get('/fluids/calendar', { params: { year, month } }),
};

export const trackedDrinkApi = {
  getDrinks: () => api.get('/tracked-drinks'),
  addDrink: (data) => api.post('/tracked-drinks', data),
  logDrink: (id, amountMl, calories) => api.post(`/tracked-drinks/${id}/log`, { amountMl, calories }),
  deleteDrink: (id) => api.delete(`/tracked-drinks/${id}`),
};

export const routineApi = {
  getRoutine: () => api.get('/routines'),
  toggleTask: (taskId) => api.put(`/routines/tasks/${taskId}/toggle`),
  addTask: (data) => api.post('/routines/tasks', data),
  deleteTask: (taskId) => api.delete(`/routines/tasks/${taskId}`),
  updateGoal: (dailyGoalMl) => api.put('/routines/goal', { dailyGoalMl }),
};

export const aiApi = {
  estimateCalories: (drinkName, ingredients, amountMl) =>
    api.post('/ai/estimate-calories', { drinkName, ingredients, amountMl }),
  generateDrink: (prompt, category) =>
    api.post('/ai/generate-drink', { prompt, category }),
  recommendDrinks: (conditions, deficiencies) =>
    api.post('/ai/recommend-drinks', { conditions, deficiencies }),
  search: (q) => api.get('/ai/search', { params: { q } }),
};

export const drinkApi = {
  getRequests: () => api.get('/drinks/requests'),
  createRequest: (data) => api.post('/drinks/requests', data),
};

export default api;
