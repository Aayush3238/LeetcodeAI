import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      toast.error('Authentication failed. Please try again.')
      navigate('/login')
      return
    }

    if (token) {
      setAuth(null, token)
      window.location.href = '/dashboard'
    } else {
      toast.error('No token received')
      navigate('/login')
    }
  }, [searchParams, navigate, setAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-dark-400 text-sm">Completing authentication...</p>
      </div>
    </div>
  )
}
