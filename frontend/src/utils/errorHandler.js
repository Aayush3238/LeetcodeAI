import toast from 'react-hot-toast'

/**
 * Global error handler for API calls
 * Displays user-friendly error messages using toast notifications
 */

const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  DEFAULT_ERROR: 'An unexpected error occurred. Please try again.',
}

/**
 * Handle API errors globally
 * @param {Error|AxiosError} error - The error object
 * @param {Object} options - Configuration options
 * @returns {Object} - Normalized error object
 */
export const handleApiError = (error, options = {}) => {
  const {
    showToast = true,
    logError = true,
    onError = null,
  } = options

  // Log error in development
  if (logError) {
    console.error('API Error:', error)
  }

  let errorMessage = ERROR_MESSAGES.DEFAULT_ERROR
  let errorCode = 'UNKNOWN_ERROR'
  let statusCode = null

  // Handle different error types
  if (error.response) {
    // Server responded with error status
    statusCode = error.response.status
    const data = error.response.data

    // Map status codes to messages
    switch (statusCode) {
      case 400:
        errorCode = 'VALIDATION_ERROR'
        errorMessage = data?.details 
          ? formatValidationErrors(data.details)
          : data?.error || ERROR_MESSAGES.VALIDATION_ERROR
        break
      case 401:
        errorCode = 'UNAUTHORIZED'
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED
        // Optionally trigger logout
        window.dispatchEvent(new Event('logout'))
        break
      case 403:
        errorCode = 'FORBIDDEN'
        errorMessage = ERROR_MESSAGES.FORBIDDEN
        break
      case 404:
        errorCode = 'NOT_FOUND'
        errorMessage = ERROR_MESSAGES.NOT_FOUND
        break
      case 429:
        errorCode = 'RATE_LIMITED'
        errorMessage = `${ERROR_MESSAGES.RATE_LIMITED} Try again in ${error.response.headers['x-ratelimit-reset']} seconds.`
        break
      case 500:
      case 502:
      case 503:
        errorCode = 'SERVER_ERROR'
        errorMessage = ERROR_MESSAGES.SERVER_ERROR
        break
      default:
        errorMessage = data?.error || ERROR_MESSAGES.DEFAULT_ERROR
    }
  } else if (error.request) {
    // Request made but no response
    errorCode = 'NETWORK_ERROR'
    errorMessage = ERROR_MESSAGES.NETWORK_ERROR
  } else if (error.message) {
    // Error in request setup or processing
    errorMessage = error.message
  }

  // Show toast notification
  if (showToast) {
    toast.error(errorMessage, {
      duration: 4000,
      icon: '❌',
    })
  }

  // Call custom error handler if provided
  if (onError) {
    onError({ message: errorMessage, code: errorCode, statusCode })
  }

  return {
    message: errorMessage,
    code: errorCode,
    statusCode,
    originalError: error,
  }
}

/**
 * Format validation errors from API response
 * @param {Object} details - Validation error details
 * @returns {string} - Formatted error message
 */
function formatValidationErrors(details) {
  if (typeof details === 'string') return details

  if (typeof details === 'object') {
    const errors = Object.entries(details)
      .map(([field, message]) => `${field}: ${message}`)
      .join(', ')
    return errors || ERROR_MESSAGES.VALIDATION_ERROR
  }

  return ERROR_MESSAGES.VALIDATION_ERROR
}

/**
 * Show success notification
 * @param {string} message - Success message
 * @param {Object} options - Toast options
 */
export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    duration: 3000,
    icon: '✅',
    ...options,
  })
}

/**
 * Show warning notification
 * @param {string} message - Warning message
 * @param {Object} options - Toast options
 */
export const showWarningToast = (message, options = {}) => {
  toast((t) => (
    <div className="flex items-start gap-3">
      <span className="text-lg">⚠️</span>
      <div className="flex-1">{message}</div>
    </div>
  ), {
    duration: 4000,
    ...options,
  })
}

/**
 * Show info notification
 * @param {string} message - Info message
 * @param {Object} options - Toast options
 */
export const showInfoToast = (message, options = {}) => {
  toast((t) => (
    <div className="flex items-start gap-3">
      <span className="text-lg">ℹ️</span>
      <div className="flex-1">{message}</div>
    </div>
  ), {
    duration: 3000,
    ...options,
  })
}

/**
 * Show loading toast (returns dismiss function)
 * @param {string} message - Loading message
 * @returns {Function} - Function to dismiss the toast
 */
export const showLoadingToast = (message) => {
  return toast.loading(message)
}

/**
 * Update toast message
 * @param {string} toastId - Toast ID to update
 * @param {string} message - New message
 * @param {string} type - Toast type ('success', 'error', 'loading')
 */
export const updateToast = (toastId, message, type = 'success') => {
  const icons = {
    success: '✅',
    error: '❌',
    loading: '⏳',
    info: 'ℹ️',
  }

  toast[type](message, {
    id: toastId,
    duration: type === 'loading' ? Infinity : 3000,
    icon: icons[type],
  })
}

/**
 * Dismiss a specific toast
 * @param {string} toastId - Toast ID to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId)
}

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.remove()
}

export default {
  handleApiError,
  showSuccessToast,
  showWarningToast,
  showInfoToast,
  showLoadingToast,
  updateToast,
  dismissToast,
  dismissAllToasts,
}
