import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { problemsAPI, bookmarksAPI } from '../services/api'
import { PageHeader, Badge, Skeleton } from '../components/ui'
import { Search, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react'
import { TOPICS } from '../constants'
import toast from 'react-hot-toast'

export default function Problems() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [difficulty, setDifficulty] = useState('')
  const [topic, setTopic] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('leetcodeId')
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['problems', search, difficulty, topic, page, sort],
    queryFn: () => problemsAPI.getProblems({ search, difficulty, topic, page, limit: 15, sort }).then((r) => r.data),
  })

  const { data: bookmarkData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => bookmarksAPI.getBookmarks().then((r) => r.data),
  })

  const bookmarkedIds = new Set((bookmarkData?.bookmarks || []).map((b) => b.problemId))

  const toggleMutation = useMutation({
    mutationFn: (problemId) => bookmarksAPI.toggleBookmark(problemId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      toast.success(res.data.bookmarked ? 'Bookmarked!' : 'Bookmark removed')
    },
    onError: () => toast.error('Failed to toggle bookmark'),
  })

  const filteredProblems = showBookmarksOnly
    ? (data?.problems || []).filter((p) => bookmarkedIds.has(p.id))
    : data?.problems || []

  return (
    <div className="space-y-6">
      <PageHeader title="Problems" description="Browse and filter problems">
        <button
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={`btn-ghost inline-flex items-center gap-2 text-sm ${showBookmarksOnly ? 'text-primary-400' : ''}`}
        >
          <Bookmark size={16} />
          {showBookmarksOnly ? 'Show All' : 'Bookmarks'}
        </button>
      </PageHeader>

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
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400 text-gray-500 w-10"></th>
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
                    <td colSpan={6} className="px-6 py-4"><Skeleton className="h-5 w-full" /></td>
                  </tr>
                ))
              ) : filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-dark-500 text-gray-400">
                    {showBookmarksOnly ? 'No bookmarked problems yet' : 'No problems found'}
                  </td>
                </tr>
              ) : (
                filteredProblems.map((p, i) => (
                  <motion.tr
                    key={p.leetcodeId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-dark-800/50 border-gray-200/50 hover:bg-dark-800/30 hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-3 py-4">
                      <button
                        onClick={() => toggleMutation.mutate(p.id)}
                        className="p-1 rounded-lg hover:bg-dark-800 hover:bg-gray-200 transition-colors"
                        disabled={toggleMutation.isPending}
                      >
                        {bookmarkedIds.has(p.id) ? (
                          <BookmarkCheck size={16} className="text-primary-400" />
                        ) : (
                          <Bookmark size={16} className="text-dark-500 text-gray-400" />
                        )}
                      </button>
                    </td>
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

      {data && !showBookmarksOnly && (
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
