import { motion } from 'framer-motion'
import { AlertCircle, Search, Inbox, RefreshCw } from 'lucide-react'

/**
 * Empty state component for when no data is available
 */
export function EmptyState({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  action = null,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="mb-4">
        <Icon size={48} className="text-dark-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-dark-400 text-sm max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  )
}

/**
 * Error card component for displaying errors in content areas
 */
export function ErrorCard({ 
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry = null,
  icon: Icon = AlertCircle,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-red-500/10 border border-red-500/30 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <Icon size={24} className="text-red-400 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <p className="text-red-300/90 text-sm mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Loading skeleton component
 */
export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-dark-700 animate-pulse rounded ${className}`} />
  )
}

/**
 * No results found component
 */
export function NoResultsFound({ 
  query = '',
  onReset = null,
  className = ''
}) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={query 
        ? `We couldn't find anything matching "${query}". Try adjusting your search.`
        : "Try adjusting your filters or search terms."
      }
      action={onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded font-medium transition-colors text-sm"
        >
          Reset Filters
        </button>
      )}
      className={className}
    />
  )
}

/**
 * Data loading skeleton grid
 */
export function SkeletonGrid({ count = 6, columns = 3 }) {
  return (
    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`}>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  )
}

/**
 * Loading skeleton list
 */
export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  )
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-2 border-primary-500 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-dark-400 text-sm">{text}</p>}
    </div>
  )
}

/**
 * Content loader animation
 */
export function ContentLoader({ text = 'Loading content...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full" />
      </motion.div>
      <p className="text-dark-400 text-sm">{text}</p>
    </motion.div>
  )
}

/**
 * Success banner component
 */
export function SuccessBanner({ 
  message,
  onDismiss,
  autoHide = true,
  duration = 5000
}) {
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false)
        onDismiss?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoHide, duration, onDismiss])

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-green-500/10 border border-green-500/30 rounded p-4 mb-4 flex items-start gap-3"
    >
      <span className="text-lg flex-shrink-0">✅</span>
      <p className="text-green-300 text-sm flex-1">{message}</p>
      <button
        onClick={() => {
          setVisible(false)
          onDismiss?.()
        }}
        className="text-dark-400 hover:text-white transition-colors"
      >
        ✕
      </button>
    </motion.div>
  )
}

/**
 * Warning banner component
 */
export function WarningBanner({ 
  message,
  onDismiss,
  action = null
}) {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 mb-4 flex items-start gap-3"
    >
      <span className="text-lg flex-shrink-0">⚠️</span>
      <div className="flex-1">
        <p className="text-yellow-300 text-sm">{message}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
      <button
        onClick={() => {
          setVisible(false)
          onDismiss?.()
        }}
        className="text-dark-400 hover:text-white transition-colors"
      >
        ✕
      </button>
    </motion.div>
  )
}

export default {
  EmptyState,
  ErrorCard,
  Skeleton,
  NoResultsFound,
  SkeletonGrid,
  SkeletonList,
  LoadingSpinner,
  ContentLoader,
  SuccessBanner,
  WarningBanner,
}
