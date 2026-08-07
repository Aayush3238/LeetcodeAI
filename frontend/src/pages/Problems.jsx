import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { problemsAPI } from '../services/api'
import { PageHeader, Input, Badge, Skeleton } from '../components/ui'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { TOPICS } from '../constants'
import { getDifficultyColor } from '../utils'

export default function Problems() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [topic, setTopic] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('leetcodeId')

  const { data, isLoading } = useQuery({
    queryKey: ['problems', search, difficulty, topic, page, sort],
    queryFn: () => problemsAPI.getProblems({ search, difficulty, topic, page, limit: 15, sort }).then((r) => r.data),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Problems" description="Browse and filter problems" />

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search problems..."
              className="input pl-10 w-full"
            />
          </div>
          <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1) }} className="input">
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={topic} onChange={(e) => { setTopic(e.target.value); setPage(1) }} className="input bg-white dark:bg-dark-900">
            <option value="">All Topics</option>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-800 border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400 text-gray-500">#</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400 text-gray-500">Title</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400 text-gray-500">Difficulty</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400 text-gray-500">Topic</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400 text-gray-500">Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="border-b border-dark-800/50 border-gray-200/50">
                    <td colSpan={5} className="px-6 py-4"><Skeleton className="h-5 w-full" /></td>
                  </tr>
                ))
              ) : (
                (data?.problems || []).map((p, i) => (
                  <motion.tr
                    key={p.leetcodeId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-dark-800/50 border-gray-200/50 hover:bg-dark-800/30 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-dark-500 text-gray-400 text-sm">{p.leetcodeId}</td>
                    <td className="px-6 py-4 font-medium">{p.title}</td>
                    <td className="px-6 py-4">
                      <span className={`difficulty-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge>{p.topic}</Badge>
                    </td>
                    <td className="px-6 py-4 text-dark-400 text-gray-500 text-sm">{p.acceptance}%</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data && (
        <div className="flex items-center justify-between">
          <p className="text-dark-400 text-gray-500 text-sm">Showing {((page - 1) * 15) + 1}-{Math.min(page * 15, data.total)} of {data.total}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-50">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-dark-400 text-gray-500">Page {page} of {data.totalPages}</span>
            <button onClick={() => setPage(Math.min(data.totalPages, page + 1))} disabled={page === data.totalPages} className="btn-ghost p-2 disabled:opacity-50">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
