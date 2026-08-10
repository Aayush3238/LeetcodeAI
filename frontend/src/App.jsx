import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'
import { useAuthInit } from './hooks/useAuthInit'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import ErrorBoundary from './components/ErrorBoundary'
import SessionExpiryWarning from './components/SessionExpiryWarning'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OAuthCallback from './pages/OAuthCallback'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Problems from './pages/Problems'
import Submissions from './pages/Submissions'
import AICoach from './pages/AICoach'
import WeakTopics from './pages/WeakTopics'
import RevisionPlan from './pages/RevisionPlan'
import GitHubRepos from './pages/GitHubRepos'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" /> : children
}

function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-dark-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

function AppRoutes() {
  useKeyboardShortcuts()
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="problems" element={<Problems />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="ai-coach" element={<AICoach />} />
        <Route path="weak-topics" element={<WeakTopics />} />
        <Route path="revision-plan" element={<RevisionPlan />} />
        <Route path="github" element={<GitHubRepos />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  const authLoading = useAuthInit()

  if (authLoading) return <AuthLoader />

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster position="top-right" toastOptions={{ className: 'bg-dark-800 text-dark-100 border border-dark-700' }} />
        <SessionExpiryWarning />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
