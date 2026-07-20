import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { authAPI } from '../services/api'
import { PageHeader, Button } from '../components/ui'
import { Settings as SettingsIcon, User, Key, Trash2, Moon, Sun } from 'lucide-react'
import toast from 'react-hot-toast'

function getStoredTheme() {
  if (typeof window !== 'undefined') return localStorage.getItem('theme') || 'dark'
  return 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.remove('dark')
    root.classList.add('light')
  }
  localStorage.setItem('theme', theme)
}

export default function Settings() {
  const { user, updateUser, logout } = useAuthStore()
  const [theme, setTheme] = useState(getStoredTheme)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '')
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || '', leetcodeUsername: user?.leetcodeUsername || '' },
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const onUpdateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data)
      updateUser(res.data.user)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const onSaveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey)
    toast.success('API key saved locally')
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data.')) return
    try {
      await authAPI.deleteAccount()
      toast.success('Account deleted')
      logout()
    } catch {
      toast.error('Failed to delete account')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Manage your account preferences" />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <User size={18} className="text-primary-400" />
          <h3 className="font-semibold">Profile</h3>
        </div>
        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Name</label>
            <input {...register('name', { required: true })} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">LeetCode Username</label>
            <input {...register('leetcodeUsername')} className="input w-full" placeholder="your_leetcode_username" />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key size={18} className="text-primary-400" />
          <h3 className="font-semibold">API Keys</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">OpenAI API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="input w-full"
              placeholder="sk-..."
            />
            <p className="text-dark-500 text-xs mt-1">Stored in your browser's localStorage</p>
          </div>
          <Button variant="secondary" onClick={onSaveApiKey}>Save API Key</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon size={18} className="text-primary-400" />
          <h3 className="font-semibold">Appearance</h3>
        </div>
        <div className="flex gap-3">
          {['dark', 'light'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${theme === t ? 'border-primary-500 bg-primary-600/10' : 'border-dark-700 hover:border-dark-600'}`}
            >
              {t === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              <span className="capitalize">{t}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 border-red-400/20">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 size={18} className="text-red-400" />
          <h3 className="font-semibold text-red-400">Danger Zone</h3>
        </div>
        <p className="text-dark-400 text-sm mb-4">Permanently delete your account and all associated data.</p>
        <Button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">Delete Account</Button>
      </motion.div>
    </div>
  )
}
