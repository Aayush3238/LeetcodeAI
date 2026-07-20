import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { dashboardAPI, authAPI } from '../services/api'
import { PageHeader, StatCard, Skeleton, Button } from '../components/ui'
import { User, Code2, Award, TrendingUp, Link2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', leetcodeUsername: user?.leetcodeUsername || '' },
  })

  const { data: dashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getDashboard().then((r) => r.data),
  })

  const { data: weakTopics } = useQuery({
    queryKey: ['weak-topics'],
    queryFn: () => dashboardAPI.getWeakTopics().then((r) => r.data),
  })

  const onSubmit = async (data) => {
    try {
      const res = await authAPI.updateProfile(data)
      updateUser(res.data.user)
      setEditing(false)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const stats = dashboard?.stats || {}

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your LeetCoach profile" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-dark-400 mt-1">{user?.email}</p>
            {user?.leetcodeUsername && (
              <div className="flex items-center justify-center gap-2 mt-3 text-primary-400">
                <Link2 size={14} />
                <span className="text-sm">leetcode.com/u/{user.leetcodeUsername}</span>
              </div>
            )}
            <button onClick={() => setEditing(!editing)} className="btn-secondary mt-6 w-full">
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          {editing && (
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Name</label>
                <input {...register('name', { required: true })} className="input w-full" />
                {errors.name && <p className="text-red-400 text-sm">Name is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">LeetCode Username</label>
                <input {...register('leetcodeUsername')} className="input w-full" placeholder="your_leetcode_username" />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          )}

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Solved" value={stats.totalSolved || 0} icon={Code2} color="text-green-400" />
            <StatCard label="Acceptance" value={`${stats.acceptanceRate || 0}%`} icon={Award} color="text-yellow-400" />
            <StatCard label="Contest Rating" value={stats.contestRating || 'N/A'} icon={TrendingUp} color="text-primary-400" />
            <StatCard label="Ranking" value={`#${stats.ranking?.toLocaleString() || 'N/A'}`} icon={User} color="text-purple-400" />
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-3">Strength Overview</h3>
            <p className="text-dark-400 text-sm mb-4">Overall strength: <span className="text-primary-400 font-bold">{weakTopics?.overallStrength || 0}%</span></p>
            <div className="space-y-3">
              {(weakTopics?.topics || []).slice(0, 6).map((t) => (
                <div key={t.topic}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-300">{t.topic}</span>
                    <span className="text-dark-500">{t.strengthScore}%</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.strengthScore}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full bg-primary-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
