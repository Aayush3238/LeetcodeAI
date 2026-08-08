import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Code2, Eye, EyeOff, ArrowLeft, CheckCircle, Key } from 'lucide-react'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 bg-gray-50 px-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Invalid Reset Link</h2>
          <p className="text-dark-400 text-gray-500">This password reset link is invalid or missing a token.</p>
          <Link to="/forgot-password" className="btn-primary">Request a New Link</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setResetting(true)
    try {
      await authAPI.resetPassword(token, password)
      setSuccess(true)
      toast.success('Password reset successful!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 bg-gray-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
            <Code2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-dark-400 text-gray-500 mt-2">Enter your new password below</p>
        </div>

        <div className="card p-8">
          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle size={48} className="text-green-400 mx-auto" />
              <h3 className="text-lg font-semibold">Password Reset!</h3>
              <p className="text-dark-400 text-gray-500 text-sm">Your password has been updated successfully.</p>
              <button onClick={() => navigate('/login')} className="btn-primary mt-4">
                Sign In with New Password
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 text-gray-600 mb-2">New Password</label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full pl-10 pr-10"
                    placeholder="Min 6 characters"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 text-gray-600 mb-2">Confirm Password</label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input w-full pl-10"
                    placeholder="Repeat your password"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={resetting} className="btn-primary w-full py-3">
                {resetting ? 'Resetting...' : 'Reset Password'}
              </button>

              <p className="text-center">
                <Link to="/login" className="text-sm text-dark-400 text-gray-500 hover:text-primary-400 inline-flex items-center gap-1">
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
