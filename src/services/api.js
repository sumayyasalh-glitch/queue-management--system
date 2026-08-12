import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify'),
};

// Appointment APIs
export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  create: (data) => api.post('/appointments', data),
  getById: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  reschedule: (id, data) => api.put(`/appointments/${id}/reschedule`, data),
};

// Queue APIs
export const queueAPI = {
  getCurrentQueue: () => api.get('/queue/current'),
  getQueueStatus: () => api.get('/queue/status'),
  generateToken: (appointmentId) => api.post('/queue/generate-token', { appointmentId }),
  updateQueueStatus: (tokenId, status) => api.put(`/queue/${tokenId}`, { status }),
};

// Doctor/Staff APIs
export const scheduleAPI = {
  getSchedules: () => api.get('/schedules'),
  getAvailableSlots: (doctorId, date) => api.get(`/schedules/available-slots`, { params: { doctorId, date } }),
  getStaff: () => api.get('/staff'),
  updateSchedule: (id, data) => api.put(`/schedules/${id}`, data),
  getStaffSchedule: (staffId) => api.get(`/schedules/staff/${staffId}`),
};

// Patient History APIs
export const historyAPI = {
  getHistory: () => api.get('/patient-history'),
  getHistoryById: (id) => api.get(`/patient-history/${id}`),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
};

export default api;
