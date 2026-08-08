import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Code2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)
    try {
      await authAPI.forgotPassword(email.trim())
      setSent(true)
      toast.success('Reset link sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 bg-gray-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
            <Code2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-dark-400 text-gray-500 mt-2">Enter your email to receive a reset link</p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle size={48} className="text-green-400 mx-auto" />
              <h3 className="text-lg font-semibold">Check Your Email</h3>
              <p className="text-dark-400 text-gray-500 text-sm">
                If an account exists with <span className="font-medium text-dark-200 text-gray-700">{email}</span>,
                you'll receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2 mt-4">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 text-gray-600 mb-2">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input w-full pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={sending} className="btn-primary w-full py-3">
                {sending ? 'Sending...' : 'Send Reset Link'}
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
