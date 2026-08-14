import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils'

/**
 * Form field component with validation error display
 */
export function FormField({
  label,
  name,
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  onBlur = () => {},
  error = null,
  success = false,
  hint = null,
  required = false,
  disabled = false,
  icon: Icon = null,
  autoComplete = 'off',
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const displayType = isPassword && showPassword ? 'text' : type

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Input */}
        <input
          id={name}
          name={name}
          type={displayType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            'w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-white placeholder-dark-500 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900',
            {
              'border-red-500/50 focus:border-red-500 focus:ring-red-500': error,
              'border-green-500/50 focus:border-green-500 focus:ring-green-500': success && !error,
              'border-dark-700 focus:border-primary-500 focus:ring-primary-500': !error && !success,
              'opacity-50 cursor-not-allowed': disabled,
              'pl-10': Icon,
              'pr-10': isPassword,
            },
            className
          )}
          {...props}
        />

        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
            <Icon size={18} />
          </div>
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Success Indicator */}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
            <CheckCircle size={18} />
          </div>
        )}

        {/* Error Indicator */}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
            <AlertCircle size={18} />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 text-red-400 text-xs"
        >
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Success Message */}
      {success && !error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 text-green-400 text-xs"
        >
          <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>All good!</span>
        </motion.div>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="text-dark-400 text-xs">{hint}</p>
      )}
    </div>
  )
}

/**
 * Textarea field component
 */
export function TextAreaField({
  label,
  name,
  placeholder = '',
  value = '',
  onChange = () => {},
  onBlur = () => {},
  error = null,
  success = false,
  hint = null,
  required = false,
  disabled = false,
  rows = 4,
  maxLength = null,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            'w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-white placeholder-dark-500 resize-none transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900',
            {
              'border-red-500/50 focus:border-red-500 focus:ring-red-500': error,
              'border-green-500/50 focus:border-green-500 focus:ring-green-500': success && !error,
              'border-dark-700 focus:border-primary-500 focus:ring-primary-500': !error && !success,
              'opacity-50 cursor-not-allowed': disabled,
            },
            className
          )}
          {...props}
        />
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="flex-1">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 text-red-400 text-xs"
            >
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && !error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 text-green-400 text-xs"
            >
              <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>All good!</span>
            </motion.div>
          )}

          {hint && !error && (
            <p className="text-dark-400 text-xs">{hint}</p>
          )}
        </div>

        {maxLength && (
          <p className={cn('text-xs font-medium', {
            'text-red-400': value.length === maxLength,
            'text-dark-500': value.length < maxLength,
          })}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Select field component
 */
export function SelectField({
  label,
  name,
  options = [],
  value = '',
  onChange = () => {},
  onBlur = () => {},
  error = null,
  success = false,
  hint = null,
  required = false,
  disabled = false,
  placeholder = 'Select an option...',
  className = '',
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-2.5 bg-dark-800 border rounded-lg text-white transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900',
          {
            'border-red-500/50 focus:border-red-500 focus:ring-red-500': error,
            'border-green-500/50 focus:border-green-500 focus:ring-green-500': success && !error,
            'border-dark-700 focus:border-primary-500 focus:ring-primary-500': !error && !success,
            'opacity-50 cursor-not-allowed': disabled,
          },
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 text-red-400 text-xs"
        >
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      {hint && !error && (
        <p className="text-dark-400 text-xs">{hint}</p>
      )}
    </div>
  )
}

/**
 * Checkbox field component
 */
export function CheckboxField({
  label,
  name,
  checked = false,
  onChange = () => {},
  error = null,
  hint = null,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'w-4 h-4 rounded border-dark-600 text-primary-600 cursor-pointer transition-colors',
            'focus:ring-2 focus:ring-primary-500',
            {
              'opacity-50 cursor-not-allowed': disabled,
            },
            className
          )}
          {...props}
        />
        <span className="text-sm text-white">{label}</span>
      </label>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 text-red-400 text-xs"
        >
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      {hint && !error && (
        <p className="text-dark-400 text-xs">{hint}</p>
      )}
    </div>
  )
}

/**
 * Form validation error summary
 */
export function ErrorSummary({ errors = {} }) {
  const errorList = Object.entries(errors).filter(([, error]) => error)

  if (errorList.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4"
    >
      <h3 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
        <AlertCircle size={16} />
        Please fix the following errors:
      </h3>
      <ul className="space-y-1">
        {errorList.map(([field, error]) => (
          <li key={field} className="text-red-300 text-xs">
            • {field.charAt(0).toUpperCase() + field.slice(1)}: {error}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default {
  FormField,
  TextAreaField,
  SelectField,
  CheckboxField,
  ErrorSummary,
}
