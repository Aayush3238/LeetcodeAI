import { cn } from '../../utils'

// Core Components
export function Skeleton({ className, ...props }) {
  return <div className={cn('skeleton', className)} {...props} />
}

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  )
}

export function GlassCard({ className, children, ...props }) {
  return (
    <div className={cn('glass-card', className)} {...props}>
      {children}
    </div>
  )
}

export function Button({ variant = 'primary', className, children, ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  }
  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  )
}

export function Input({ className, ...props }) {
  return <input className={cn('input w-full', className)} {...props} />
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-dark-800 bg-gray-100 text-dark-300 text-gray-600',
    primary: 'bg-primary-600/10 text-primary-400 border border-primary-600/20',
    success: 'bg-green-400/10 text-green-400',
    warning: 'bg-yellow-400/10 text-yellow-400',
    danger: 'bg-red-400/10 text-red-400',
  }
  return (
    <span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

export function StatCard({ label, value, icon: Icon, trend, color = 'text-primary-400' }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-gray-500 text-sm">{label}</p>
          <p className={cn('text-2xl font-bold mt-1', color)}>{value}</p>
          {trend && <p className="text-green-400 text-xs mt-1">{trend}</p>}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl bg-dark-800 bg-gray-100', color)}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={48} className="text-dark-600 text-gray-300 mb-4" />}
      <h3 className="text-lg font-medium text-dark-300 text-gray-600">{title}</h3>
      {description && <p className="text-dark-500 text-gray-400 mt-1 max-w-md">{description}</p>}
    </div>
  )
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-50 text-gray-900">{title}</h1>
        {description && <p className="text-dark-400 text-gray-500 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// Export all state components
export {
  EmptyState as EmptyStateNew,
  ErrorCard,
  Skeleton as SkeletonNew,
  NoResultsFound,
  SkeletonGrid,
  SkeletonList,
  LoadingSpinner,
  ContentLoader,
  SuccessBanner,
  WarningBanner,
} from './StateComponents'

// Export all form components
export {
  FormField,
  TextAreaField,
  SelectField,
  CheckboxField,
  ErrorSummary,
} from './FormComponents'
