import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'
import { AlertTriangle, RefreshCw } from 'lucide-react'

function parseJWT(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export default function SessionExpiryWarning() {
  const { token, refreshToken, setToken, logout } = useAuthStore()
  const [show, setShow] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const checkExpiry = useCallback(() => {
    if (!token) return
    const payload = parseJWT(token)
    if (!payload?.exp) return

    const expiresAt = payload.exp * 1000
    const now = Date.now()
    const diff = expiresAt - now

    if (diff <= 0) {
      logout()
      window.location.href = '/login'
      return
    }

    if (diff < 5 * 60 * 1000) {
      setRemaining(Math.floor(diff / 1000))
      setShow(true)
    }
  }, [token, logout])

  useEffect(() => {
    checkExpiry()
    const interval = setInterval(checkExpiry, 30000)
    return () => clearInterval(interval)
  }, [checkExpiry])

  const handleRefresh = async () => {
    if (!refreshToken) {
      logout()
      return
    }
    setRefreshing(true)
    try {
      const res = await axios.post('/api/auth/refresh', { refreshToken })
      setToken(res.data.accessToken)
      setShow(false)
    } catch {
      logout()
      window.location.href = '/login'
    } finally {
      setRefreshing(false)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  if (!show) return null

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="card p-6 max-w-sm w-full text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center mx-auto">
          <AlertTriangle size={28} className="text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold">Session Expiring</h2>
        <p className="text-dark-400 text-gray-500 text-sm">
          Your session expires in{' '}
          <span className="font-mono font-bold text-yellow-400">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </p>
        <div className="flex gap-3">
          <button onClick={handleLogout} className="btn-ghost flex-1">
            Sign Out
          </button>
          <button onClick={handleRefresh} disabled={refreshing} className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Session'}
          </button>
        </div>
      </div>
    </div>
  )
}
