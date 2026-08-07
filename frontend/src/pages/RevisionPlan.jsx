import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { aiAPI, dashboardAPI } from '../services/api'
import { PageHeader, Button, Badge, Skeleton } from '../components/ui'
import { Calendar, Clock, CheckCircle, Circle } from 'lucide-react'
import { formatTime } from '../utils'

const PLAN_TYPES = [
  { value: '7day', label: '7 Day Plan', description: 'Intensive week-long focus' },
  { value: '30day', label: '30 Day Plan', description: 'Structured monthly plan' },
  { value: '60day', label: '60 Day Plan', description: 'Comprehensive mastery plan' },
]

export default function RevisionPlan() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [planData, setPlanData] = useState(null)

  const { data: weakTopicsData } = useQuery({
    queryKey: ['weak-topics'],
    queryFn: () => dashboardAPI.getWeakTopics().then((r) => r.data),
  })

  const weakTopics = (weakTopicsData?.weakTopics || []).map((t) => t.topic)

  const { mutate: generatePlan, isPending } = useMutation({
    mutationFn: (planType) => aiAPI.generateRevisionPlan({
      weakTopics: weakTopics.length > 0 ? weakTopics : ['Dynamic Programming', 'Graph', 'Binary Search'],
      planType,
    }).then((r) => r.data.plan),
    onSuccess: (plan) => setPlanData(plan),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Revision Plan" description="AI-generated study plans based on your weak areas" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLAN_TYPES.map((pt) => (
          <motion.button
            key={pt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedPlan(pt.value); generatePlan(pt.value) }}
            disabled={isPending}
            className={`card p-6 text-left transition-all ${selectedPlan === pt.value ? 'border-primary-500 ring-1 ring-primary-500' : 'hover:border-dark-700 hover:border-gray-300'}`}
          >
            <Calendar size={24} className="text-primary-400 mb-3" />
            <h3 className="font-bold text-lg">{pt.label}</h3>
            <p className="text-dark-400 text-gray-500 text-sm mt-1">{pt.description}</p>
          </motion.button>
        ))}
      </div>

      {weakTopics.length > 0 && (
        <div className="card p-4">
          <p className="text-sm text-dark-400 text-gray-500 mb-2">Your weak topics:</p>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((t) => <Badge key={t} variant="danger">{t}</Badge>)}
          </div>
        </div>
      )}

      {isPending && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      )}

      {planData && !isPending && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-dark-400 text-gray-500">
            <span className="flex items-center gap-1"><Clock size={14} /> {planData.items?.length || 0} days</span>
            <Badge variant="primary">{planData.type}</Badge>
          </div>

          <div className="space-y-3">
            {(planData.items || []).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card p-4 flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-400 font-bold text-sm">
                  {item.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{item.topic}</h4>
                    <Badge>{formatTime(item.estimatedTime)}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(item.problems || []).map((prob, j) => (
                      <span key={j} className="text-xs bg-dark-800 bg-gray-100 text-dark-300 text-gray-600 px-2 py-1 rounded-lg">{prob}</span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {item.completed ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <Circle size={20} className="text-dark-600 text-gray-300" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {!planData && !isPending && (
        <div className="card p-12 text-center">
          <Calendar size={48} className="text-dark-600 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-300 text-gray-600">Select a Plan Duration</h3>
          <p className="text-dark-500 text-gray-400 mt-1">Choose a plan to generate your personalized revision schedule</p>
        </div>
      )}
    </div>
  )
}
