import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { dashboardAPI } from '../services/api'
import { PageHeader, Badge, Skeleton, EmptyState } from '../components/ui'
import { Target, TrendingUp, TrendingDown } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

function RadarSkeleton() {
  return <Skeleton className="h-96" />
}

export default function WeakTopics() {
  const { data, isLoading } = useQuery({
    queryKey: ['weak-topics'],
    queryFn: () => dashboardAPI.getWeakTopics().then((r) => r.data),
  })

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <RadarSkeleton />
    </div>
  )

  const radarData = (data?.topics || []).map((t) => ({
    topic: t.topic,
    strength: t.strengthScore,
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="Weak Topics" description="Identify areas for improvement" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Strength Radar</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Strength" dataKey="strength" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} wrapperStyle={{ color: '#f1f5f9' }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-green-400/10"><TrendingUp size={18} className="text-green-400" /></div>
              <h3 className="font-semibold">Strong Topics</h3>
            </div>
            <div className="space-y-3">
              {(data?.strongTopics || []).map((t) => (
                <div key={t.topic} className="flex items-center justify-between p-3 bg-dark-800/50 bg-gray-100/50 rounded-xl">
                  <span className="text-sm">{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-dark-700 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: `${t.strengthScore}%` }} />
                    </div>
                    <span className="text-xs text-dark-400 text-gray-500 w-8 text-right">{t.strengthScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-red-400/10"><TrendingDown size={18} className="text-red-400" /></div>
              <h3 className="font-semibold">Weak Topics</h3>
            </div>
            <div className="space-y-3">
              {(data?.weakTopics || []).map((t) => (
                <div key={t.topic} className="flex items-center justify-between p-3 bg-dark-800/50 bg-gray-100/50 rounded-xl">
                  <span className="text-sm">{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-dark-700 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${t.strengthScore}%` }} />
                    </div>
                    <span className="text-xs text-dark-400 text-gray-500 w-8 text-right">{t.strengthScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h3 className="font-semibold mb-4">Recommendations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.weakTopics || []).slice(0, 3).map((t) => (
            <div key={t.topic} className="p-4 bg-dark-800/50 bg-gray-100/50 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-primary-400" />
                <span className="font-medium text-sm">{t.topic}</span>
              </div>
              <p className="text-dark-400 text-gray-500 text-xs">
                Practice {t.problemCount} more problems to improve your {t.topic} skills.
                Focus on understanding patterns and edge cases.
              </p>
              <Badge variant="danger">{t.strengthScore}% strength</Badge>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
