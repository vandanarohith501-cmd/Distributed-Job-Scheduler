import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/accounts/login/refresh/`, {
          refresh,
        });
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/accounts/register/', userData),
  login: (credentials) => api.post('/accounts/login/', credentials),
  getUser: () => api.get('/accounts/user/'),
};

export const profileAPI = {
  getProfile: () => api.get('/accounts/freelancer-profile/'),
  createProfile: (profileData) => api.post('/accounts/freelancer-profile/', profileData),
  updateProfile: (id, profileData) => api.put(`/accounts/freelancer-profile/${id}/`, profileData),
};

export const jobAPI = {
  getJobs: () => api.get('/accounts/jobs/'),
  getJob: (id) => api.get(`/accounts/jobs/${id}/`),
  createJob: (jobData) => api.post('/accounts/jobs/', jobData),
  updateJob: (id, jobData) => api.put(`/accounts/jobs/${id}/`, jobData),
  deleteJob: (id) => api.delete(`/accounts/jobs/${id}/`),
};

export const applicationAPI = {
  getApplications: () => api.get('/accounts/applications/'),
  applyForJob: (applicationData) => api.post('/accounts/applications/', applicationData),
  updateApplication: (id, status) => api.patch(`/accounts/applications/${id}/`, { status }),
};

export const notificationAPI = {
  getNotifications: () => api.get('/accounts/notifications/'),
  markAsRead: (id) => api.patch(`/accounts/notifications/${id}/mark-read/`, { is_read: true }),
};

export const skillsAPI = {
  getSkills: () => api.get('/accounts/skills/'),
  getTechStacks: () => api.get('/accounts/tech-stacks/'),
};

export default api;