import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const DEMO_USERS_KEY = 'queuecare_users';

const isOfflineError = (error) => {
  if (!error) return false;
  const message = error.message || '';
  return (
    !error.response &&
    (
      error.code === 'ERR_NETWORK' ||
      message === 'Network Error' ||
      message.includes('ECONNREFUSED') ||
      message.includes('Failed to fetch') ||
      message.includes('NetworkError')
    )
  );
};

const readDemoUsers = () => {
  try {
    const raw = localStorage.getItem(DEMO_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const writeDemoUsers = (users) => {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
};

const stripPassword = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const buildDemoUser = (data) => {
  const firstName = String(data.firstName || '').trim();
  const lastName = String(data.lastName || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const password = String(data.password || '');

  return {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    phone: String(data.phone || '').trim(),
    role: data.role || 'patient',
    password,
    createdAt: new Date().toISOString(),
  };
};

const withDemoFallback = async (requestFn, fallbackFn) => {
  try {
    return await requestFn();
  } catch (error) {
    if (isOfflineError(error)) {
      return fallbackFn();
    }
    throw error;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Auth APIs
export const authAPI = {
  signup: (data) =>
    withDemoFallback(
      () => api.post('/auth/signup', data),
      async () => {
        const users = readDemoUsers();
        const email = String(data.email || '').trim().toLowerCase();

        if (users.some((user) => user.email === email)) {
          const error = new Error('User already exists');
          error.response = { data: { message: 'An account with this email already exists.' } };
          throw error;
        }

        const newUser = buildDemoUser(data);
        users.push(newUser);
        writeDemoUsers(users);

        const token = `demo-token-${Date.now()}`;
        const user = stripPassword(newUser);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return { data: { token, user } };
      }
    ),

  login: (data) =>
    withDemoFallback(
      () => api.post('/auth/login', data),
      async () => {
        const users = readDemoUsers();
        const email = String(data.email || '').trim().toLowerCase();
        const password = String(data.password || '');

        const userRecord = users.find(
          (user) => user.email === email && user.password === password
        );

        if (!userRecord) {
          const error = new Error('Invalid credentials');
          error.response = { data: { message: 'Invalid email or password.' } };
          throw error;
        }

        const token = `demo-token-${Date.now()}`;
        const user = stripPassword(userRecord);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return { data: { token, user } };
      }
    ),

  logout: () =>
    withDemoFallback(
      () => api.post('/auth/logout'),
      async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { data: { success: true } };
      }
    ),

  verifyToken: () =>
    withDemoFallback(
      () => api.get('/auth/verify'),
      async () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');

        if (!token || !token.startsWith('demo-token-') || !user) {
          const error = new Error('Invalid token');
          error.response = { data: { message: 'Session expired. Please log in again.' } };
          throw error;
        }

        return { data: { valid: true, user } };
      }
    ),
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
