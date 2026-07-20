import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { authAPI } from '../services/api'

export function useAuthInit() {
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, token, setAuth, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false)
      return
    }

    authAPI.getProfile()
      .then((res) => {
        setAuth(res.data.user, token)
      })
      .catch(() => {
        logout()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return loading
}
