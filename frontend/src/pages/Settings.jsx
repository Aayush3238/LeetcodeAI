import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { authAPI } from '../services/api'
import { PageHeader, Button, Input } from '../components/ui'
import { Settings as SettingsIcon, User, Key, Trash2, Moon, Sun } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, updateUser, logout } = useAuthStore()
  const [theme, setTheme] = useState('dark')
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || '', leetcodeUsername: user?.leetcodeUsername || '' },
  })

  const onUpdateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data)
      updateUser(res.data.user)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      toast.success('Account deleted (demo)')
      logout()
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
            <input type="password" className="input w-full" placeholder="sk-..." />
            <p className="text-dark-500 text-xs mt-1">Used for AI code analysis and coaching</p>
          </div>
          <Button variant="secondary">Save API Key</Button>
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
