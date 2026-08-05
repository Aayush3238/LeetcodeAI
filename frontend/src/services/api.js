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
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true
      const { refreshToken, setToken, logout } = useAuthStore.getState()

      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh', { refreshToken })
          setToken(res.data.accessToken)
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
          return api(originalRequest)
        } catch {
          logout()
          window.location.href = '/login'
        }
      } else {
        logout()
        window.location.href = '/login'
      }
    }

    if (error.response?.status === 401 && !error.response?.data?.code) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  setPassword: (password) => api.post('/auth/set-password', { password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  deleteAccount: () => api.delete('/auth/account'),
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
  chatStream: async function* (data) {
    const token = useAuthStore.getState().token
    const res = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      const lines = text.split('\n').filter((l) => l.startsWith('data: '))
      for (const line of lines) {
        const payload = JSON.parse(line.slice(6))
        if (payload.done) return
        if (payload.content) yield payload.content
      }
    }
  },
  generateRevisionPlan: (data) => api.post('/ai/revision-plan', data),
  explainCode: (data) => api.post('/ai/explain', data),
}

export const leetcodeAPI = {
  getStatus: () => api.get('/leetcode/status'),
  getProfile: (username) => api.get(`/leetcode/profile/${username}`),
  connect: (username) => api.post('/leetcode/connect', { username }),
  sync: () => api.post('/leetcode/sync'),
  disconnect: () => api.post('/leetcode/disconnect'),
}

export const githubAPI = {
  getStatus: () => api.get('/github/status'),
  getRepos: () => api.get('/github/repos'),
  getStats: () => api.get('/github/stats'),
  getRepoStats: (owner, repo) => api.get(`/github/repo/${owner}/${repo}`),
  disconnect: () => api.post('/github/disconnect'),
}

export default api
