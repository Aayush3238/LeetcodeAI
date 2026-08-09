import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { githubAPI } from '../services/api'
import { PageHeader, Badge, Skeleton, EmptyState } from '../components/ui'
import { GitBranch, Star, GitFork, Users, ExternalLink, Eye, EyeOff, BarChart3 } from 'lucide-react'

function RepoDetailModal({ owner, repo, onClose }) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['repo-stats', owner, repo],
    queryFn: () => githubAPI.getRepoStats(owner, repo).then((r) => r.data.stats),
  })

  const langEntries = stats?.languages ? Object.entries(stats.languages) : []
  const totalBytes = langEntries.reduce((sum, [, bytes]) => sum + bytes, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{stats?.name || repo}</h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-800 hover:bg-gray-200 rounded-xl text-lg">&times;</button>
        </div>

        {isLoading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : stats ? (
          <div className="space-y-4">
            {stats.description && <p className="text-dark-400 text-gray-500 text-sm">{stats.description}</p>}

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-dark-800 bg-gray-100 rounded-xl text-center">
                <Star size={18} className="text-yellow-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{stats.stars}</p>
                <p className="text-dark-400 text-gray-500 text-xs">Stars</p>
              </div>
              <div className="p-3 bg-dark-800 bg-gray-100 rounded-xl text-center">
                <GitFork size={18} className="text-blue-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{stats.forks}</p>
                <p className="text-dark-400 text-gray-500 text-xs">Forks</p>
              </div>
              <div className="p-3 bg-dark-800 bg-gray-100 rounded-xl text-center">
                <GitBranch size={18} className="text-red-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{stats.issues}</p>
                <p className="text-dark-400 text-gray-500 text-xs">Issues</p>
              </div>
            </div>

            {langEntries.length > 0 && (
              <div className="p-4 bg-dark-800 bg-gray-100 rounded-xl">
                <p className="text-sm font-medium mb-3">Languages</p>
                <div className="flex h-3 rounded-full overflow-hidden mb-3">
                  {langEntries.map(([lang, bytes], i) => (
                    <div
                      key={lang}
                      style={{ width: `${(bytes / totalBytes) * 100}%` }}
                      className={`h-full ${i % 3 === 0 ? 'bg-blue-500' : i % 3 === 1 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  {langEntries.map(([lang, bytes]) => (
                    <span key={lang} className="text-xs text-dark-300 text-gray-600">
                      {lang} ({Math.round((bytes / totalBytes) * 100)}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {stats.topics?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {stats.topics.map((t) => <Badge key={t}>{t}</Badge>)}
              </div>
            )}

            <a href={stats.url} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2 text-sm">
              <ExternalLink size={14} /> View on GitHub
            </a>
          </div>
        ) : (
          <p className="text-dark-500 text-gray-400 text-center py-8">Failed to load repo stats</p>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function GitHubRepos() {
  const [selectedRepo, setSelectedRepo] = useState(null)

  const { data: stats, isLoading } = useQuery({
    queryKey: ['github-stats'],
    queryFn: () => githubAPI.getStats().then((r) => r.data.stats),
  })

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64" />
    </div>
  )

  if (!stats) return (
    <div className="space-y-6">
      <PageHeader title="GitHub" description="Connect your GitHub to see analysis" />
      <EmptyState icon={GitBranch} title="GitHub not connected" description="Connect your GitHub account in Settings to see repository analysis" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="GitHub" description={`${stats.username}'s repositories and coding patterns`} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <p className="text-2xl font-bold">{stats.publicRepos}</p>
          <p className="text-dark-400 text-gray-500 text-sm">Repos</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-2xl font-bold">{stats.totalStars}</p>
          <p className="text-dark-400 text-gray-500 text-sm">Stars</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-2xl font-bold">{stats.followers}</p>
          <p className="text-dark-400 text-gray-500 text-sm">Followers</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-2xl font-bold">{stats.languages.length}</p>
          <p className="text-dark-400 text-gray-500 text-sm">Languages</p>
        </div>
      </div>

      {stats.languages.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Language Distribution</h3>
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            {stats.languages.map((l, i) => (
              <div
                key={l.name}
                style={{ width: `${l.percentage}%` }}
                className={`h-full ${i % 4 === 0 ? 'bg-blue-500' : i % 4 === 1 ? 'bg-yellow-500' : i % 4 === 2 ? 'bg-green-500' : 'bg-purple-500'}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {stats.languages.map((l, i) => (
              <span key={l.name} className="flex items-center gap-2 text-sm text-dark-300 text-gray-600">
                <span className={`w-3 h-3 rounded-full ${i % 4 === 0 ? 'bg-blue-500' : i % 4 === 1 ? 'bg-yellow-500' : i % 4 === 2 ? 'bg-green-500' : 'bg-purple-500'}`} />
                {l.name} ({l.percentage}%)
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-800 border-gray-200">
          <h3 className="font-semibold">Top Repositories</h3>
        </div>
        <div className="divide-y divide-dark-800/50 divide-gray-200/50">
          {stats.topRepos.map((repo) => (
            <motion.div
              key={repo.fullName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-4 hover:bg-dark-800/30 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setSelectedRepo(repo.fullName.split('/'))}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{repo.name}</p>
                  <p className="text-dark-400 text-gray-500 text-sm mt-0.5 truncate">{repo.description || 'No description'}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {repo.language && <span className="text-xs text-dark-400 text-gray-500">{repo.language}</span>}
                    <span className="flex items-center gap-1 text-xs text-dark-400 text-gray-500"><Star size={12} /> {repo.stars}</span>
                    <span className="flex items-center gap-1 text-xs text-dark-400 text-gray-500"><GitFork size={12} /> {repo.forks}</span>
                  </div>
                </div>
                <ExternalLink size={16} className="text-dark-500 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedRepo && (
          <RepoDetailModal owner={selectedRepo[0]} repo={selectedRepo[1]} onClose={() => setSelectedRepo(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
