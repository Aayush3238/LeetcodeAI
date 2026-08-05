import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { authAPI, leetcodeAPI, githubAPI } from '../services/api'
import { PageHeader, Button } from '../components/ui'
import { Settings as SettingsIcon, User, Key, Trash2, Moon, Sun, Link as LinkIcon, Unlink, RefreshCw, CheckCircle, GitBranch, Shield } from 'lucide-react'
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
  const [lcUsername, setLcUsername] = useState(user?.leetcodeUsername || '')
  const [lcConnected, setLcConnected] = useState(!!user?.leetcodeUsername)
  const [lcSyncing, setLcSyncing] = useState(false)
  const [lcConnecting, setLcConnecting] = useState(false)
  const [lcLastSynced, setLcLastSynced] = useState(null)
  const [ghConnected, setGhConnected] = useState(false)
  const [ghConnecting, setGhConnecting] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [settingPassword, setSettingPassword] = useState(false)
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || '', leetcodeUsername: user?.leetcodeUsername || '' },
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    leetcodeAPI.getStatus()
      .then((res) => {
        setLcConnected(res.data.connected)
        setLcUsername(res.data.username || '')
        setLcLastSynced(res.data.lastSyncedAt)
      })
      .catch(() => {})

    githubAPI.getStatus()
      .then((res) => {
        setGhConnected(res.data.connected)
      })
      .catch(() => {})
  }, [])

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

  const handleLcConnect = async () => {
    if (!lcUsername.trim()) {
      toast.error('Enter a LeetCode username')
      return
    }
    setLcConnecting(true)
    try {
      const res = await leetcodeAPI.connect(lcUsername.trim())
      setLcConnected(true)
      updateUser({ leetcodeUsername: lcUsername.trim() })
      toast.success(`Connected! Synced ${res.data.syncedCount} problems`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to connect')
    } finally {
      setLcConnecting(false)
    }
  }

  const handleLcSync = async () => {
    setLcSyncing(true)
    try {
      const res = await leetcodeAPI.sync()
      toast.success(`Synced ${res.data.syncedCount} problems`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sync failed')
    } finally {
      setLcSyncing(false)
    }
  }

  const handleLcDisconnect = async () => {
    if (!window.confirm('Disconnect your LeetCode account?')) return
    try {
      await leetcodeAPI.disconnect()
      setLcConnected(false)
      setLcUsername('')
      updateUser({ leetcodeUsername: null })
      toast.success('LeetCode disconnected')
    } catch {
      toast.error('Failed to disconnect')
    }
  }

  const handleGithubConnect = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/github`
  }

  const handleGithubDisconnect = async () => {
    if (!window.confirm('Disconnect your GitHub account?')) return
    try {
      await githubAPI.disconnect()
      setGhConnected(false)
      toast.success('GitHub disconnected')
    } catch {
      toast.error('Failed to disconnect')
    }
  }

  const handleSetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSettingPassword(true)
    try {
      await authAPI.setPassword(newPassword)
      toast.success('Password set! You can now sign in with email/password too.')
      setNewPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set password')
    } finally {
      setSettingPassword(false)
    }
  }

  const isOAuthUser = !!user?.googleId || !!user?.githubId

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

      {isOAuthUser && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={18} className="text-primary-400" />
            <h3 className="font-semibold">Set Password</h3>
          </div>
          <p className="text-dark-400 text-sm mb-4">You signed in with a social provider. Set a password to also enable email/password login.</p>
          <div className="flex gap-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input flex-1"
              placeholder="New password (min 6 characters)"
              onKeyDown={(e) => e.key === 'Enter' && handleSetPassword()}
            />
            <Button onClick={handleSetPassword} disabled={settingPassword}>
              {settingPassword ? 'Setting...' : 'Set Password'}
            </Button>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <LinkIcon size={18} className="text-primary-400" />
          <h3 className="font-semibold">LeetCode Connection</h3>
        </div>

        {lcConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-400 text-sm font-medium">Connected as <strong>{lcUsername}</strong></span>
            </div>
            {lcLastSynced && (
              <p className="text-dark-500 text-xs">Last synced: {new Date(lcLastSynced).toLocaleString()}</p>
            )}
            <div className="flex gap-3">
              <Button onClick={handleLcSync} disabled={lcSyncing} variant="secondary">
                <RefreshCw size={16} className={lcSyncing ? 'animate-spin' : ''} />
                {lcSyncing ? 'Syncing...' : 'Sync Data'}
              </Button>
              <Button onClick={handleLcDisconnect} className="bg-red-600 hover:bg-red-700">
                <Unlink size={16} />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-dark-400 text-sm">Connect your LeetCode account to sync your solved problems and submissions.</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={lcUsername}
                onChange={(e) => setLcUsername(e.target.value)}
                className="input flex-1"
                placeholder="Enter your LeetCode username"
                onKeyDown={(e) => e.key === 'Enter' && handleLcConnect()}
              />
              <Button onClick={handleLcConnect} disabled={lcConnecting}>
                {lcConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <GitBranch size={18} className="text-primary-400" />
          <h3 className="font-semibold">GitHub Connection</h3>
        </div>

        {ghConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-400 text-sm font-medium">GitHub account connected</span>
            </div>
            <p className="text-dark-400 text-sm">Your GitHub repos and contribution data are available for AI analysis.</p>
            <Button onClick={handleGithubDisconnect} className="bg-red-600 hover:bg-red-700">
              <Unlink size={16} />
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-dark-400 text-sm">Connect GitHub to analyze your repositories and coding patterns.</p>
            <Button onClick={handleGithubConnect}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Connect GitHub
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
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

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
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

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6 border-red-400/20">
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
