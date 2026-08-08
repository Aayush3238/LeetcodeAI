import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { submissionsAPI } from '../services/api'
import { PageHeader, Badge, Button, Skeleton, EmptyState } from '../components/ui'
import { FileCode, Clock, Cpu, CheckCircle, XCircle, Bot, X, ChevronDown, ChevronUp, ExternalLink, BarChart3 } from 'lucide-react'
import { formatDate } from '../utils'

function AnalysisModal({ submission, onClose }) {
  const { mutate: analyze, data: analysis, isPending } = useMutation({
    mutationFn: () => submissionsAPI.analyze({
      code: submission.code,
      language: submission.language,
      problemTitle: submission.problem?.title,
    }).then((r) => r.data.analysis),
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">AI Code Review</h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-800 hover:bg-gray-200 rounded-xl"><X size={18} /></button>
        </div>

        {isPending ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800 bg-gray-100 rounded-xl">
                <p className="text-dark-400 text-gray-500 text-sm">Time Complexity</p>
                <p className="font-mono text-green-400 mt-1">{analysis.timeComplexity}</p>
              </div>
              <div className="p-4 bg-dark-800 bg-gray-100 rounded-xl">
                <p className="text-dark-400 text-gray-500 text-sm">Space Complexity</p>
                <p className="font-mono text-yellow-400 mt-1">{analysis.spaceComplexity}</p>
              </div>
            </div>

            <div className="p-4 bg-dark-800 bg-gray-100 rounded-xl">
              <p className="text-dark-400 text-gray-500 text-sm mb-2">Overall Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-dark-700 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${analysis.overallScore}%` }} />
                </div>
                <span className="font-bold text-lg text-primary-400">{analysis.overallScore}/100</span>
              </div>
            </div>

            <div className="p-4 bg-dark-800 bg-gray-100 rounded-xl">
              <p className="text-dark-400 text-gray-500 text-sm mb-2">Optimization Suggestions</p>
              <ul className="space-y-2">
                {(analysis.optimizations || []).map((opt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary-400 mt-0.5">•</span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-dark-800 bg-gray-100 rounded-xl">
              <p className="text-dark-400 text-gray-500 text-sm mb-2">Edge Cases</p>
              <div className="flex flex-wrap gap-2">
                {(analysis.edgeCases || []).map((ec, i) => (
                  <Badge key={i} variant="warning">{ec}</Badge>
                ))}
              </div>
            </div>

            <div className="p-4 bg-dark-800 bg-gray-100 rounded-xl">
              <p className="text-dark-400 text-gray-500 text-sm mb-1">Code Readability</p>
              <p className="text-sm">{analysis.readability}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800 bg-gray-100 rounded-xl">
                <p className="text-dark-400 text-gray-500 text-sm">Pattern</p>
                <Badge variant="primary" className="mt-1">{analysis.pattern}</Badge>
              </div>
              <div className="p-4 bg-dark-800 bg-gray-100 rounded-xl">
                <p className="text-dark-400 text-gray-500 text-sm">Difficulty Level</p>
                <Badge className="mt-1">{analysis.difficulty}</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Button onClick={() => analyze()}>Run AI Analysis</Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function SubmissionRow({ submission, onAnalyze }) {
  const [expanded, setExpanded] = useState(false)
  const p = submission.problem

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-dark-800/50 border-gray-200/50">
      <div className="flex items-center px-6 py-4 hover:bg-dark-800/30 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{p?.title || 'Unknown Problem'}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-dark-500 text-gray-400 text-xs">{submission.language}</span>
            <span className="text-dark-500 text-gray-400 text-xs flex items-center gap-1"><Clock size={12} /> {submission.runtime}ms</span>
            <span className="text-dark-500 text-gray-400 text-xs flex items-center gap-1"><Cpu size={12} /> {submission.memory}MB</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {submission.status === 'Accepted' ? (
            <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle size={14} /> Accepted</span>
          ) : (
            <span className="flex items-center gap-1 text-red-400 text-sm"><XCircle size={14} /> {submission.status}</span>
          )}
          <span className="text-dark-500 text-gray-400 text-xs">{formatDate(submission.submissionTime)}</span>
          {expanded ? <ChevronUp size={16} className="text-dark-500 text-gray-400" /> : <ChevronDown size={16} className="text-dark-500 text-gray-400" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-6 pb-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-dark-800 bg-gray-100 rounded-xl">
                  <p className="text-dark-400 text-gray-500 text-xs mb-1">Language</p>
                  <p className="font-medium text-sm">{submission.language}</p>
                </div>
                <div className="p-3 bg-dark-800 bg-gray-100 rounded-xl">
                  <p className="text-dark-400 text-gray-500 text-xs mb-1">Runtime</p>
                  <p className="font-medium text-sm flex items-center gap-1"><Clock size={12} /> {submission.runtime}ms</p>
                </div>
                <div className="p-3 bg-dark-800 bg-gray-100 rounded-xl">
                  <p className="text-dark-400 text-gray-500 text-xs mb-1">Memory</p>
                  <p className="font-medium text-sm flex items-center gap-1"><Cpu size={12} /> {submission.memory}MB</p>
                </div>
              </div>

              <pre className="bg-dark-800 bg-gray-100 rounded-xl p-4 text-sm font-mono text-dark-200 text-gray-800 overflow-x-auto scrollbar-thin max-h-96">{submission.code}</pre>

              <div className="flex items-center gap-3">
                <Button onClick={(e) => { e.stopPropagation(); onAnalyze(submission) }} variant="secondary">
                  <Bot size={16} className="mr-2" /> Analyze with AI
                </Button>
                {p?.titleSlug && (
                  <a
                    href={`https://leetcode.com/problems/${p.titleSlug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-ghost inline-flex items-center gap-2 text-sm"
                  >
                    <ExternalLink size={14} /> View on LeetCode
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Submissions() {
  const [analyzingSubmission, setAnalyzingSubmission] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => submissionsAPI.getSubmissions().then((r) => r.data),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Submissions" description="Review your past submissions" />

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : (data?.submissions || []).length === 0 ? (
          <EmptyState icon={FileCode} title="No submissions yet" description="Start solving problems to see your submissions here" />
        ) : (
          (data?.submissions || []).map((s) => (
            <SubmissionRow key={s.id} submission={s} onAnalyze={setAnalyzingSubmission} />
          ))
        )}
      </div>

      <AnimatePresence>
        {analyzingSubmission && (
          <AnalysisModal submission={analyzingSubmission} onClose={() => setAnalyzingSubmission(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
