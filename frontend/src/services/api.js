import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getAnalytics: () => api.get('/dashboard/analytics'),
  getWeakTopics: () => api.get('/dashboard/weak-topics'),
}

export const problemsAPI = {
  getProblems: (params) => api.get('/problems', { params }),
  getTopics: () => api.get('/problems/topics'),
}

export const submissionsAPI = {
  getSubmissions: () => api.get('/submissions'),
  analyze: (data) => api.post('/submissions/analyze', data),
  detectPattern: (data) => api.post('/submissions/detect-pattern', data),
}

export const aiAPI = {
  getConversations: () => api.get('/ai/conversations'),
  createConversation: (data) => api.post('/ai/conversations', data),
  sendMessage: (data) => api.post('/ai/chat', data),
  generateRevisionPlan: (data) => api.post('/ai/revision-plan', data),
  explainCode: (data) => api.post('/ai/explain', data),
}

export default api
