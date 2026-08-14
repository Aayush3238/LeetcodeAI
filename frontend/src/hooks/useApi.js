import { useCallback, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { handleApiError, showLoadingToast, updateToast, dismissToast } from '../utils/errorHandler'

/**
 * Custom hook for API calls with integrated error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Object} - Query result with loading, error, and data
 */
export function useApiQuery(endpoint, options = {}) {
  const {
    showToast = true,
    onSuccess = null,
    onError = null,
    enabled = true,
    ...queryOptions
  } = options

  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      try {
        const response = await fetch(endpoint)
        if (!response.ok) {
          const error = new Error('API Error')
          error.response = { status: response.status, data: await response.json() }
          throw error
        }
        return response.json()
      } catch (error) {
        handleApiError(error, { showToast, onError })
        throw error
      }
    },
    enabled,
    ...queryOptions,
  })
}

/**
 * Custom hook for API mutations (POST, PUT, DELETE, etc.)
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} options - Mutation options
 * @returns {Object} - Mutation object with mutate function
 */
export function useApiMutation(endpoint, method = 'POST', options = {}) {
  const {
    showToast = true,
    showLoadingToast = false,
    onSuccess = null,
    onError = null,
    successMessage = null,
    errorMessage = null,
    ...mutationOptions
  } = options

  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = new Error(errorMessage || 'API Error')
          error.response = { status: response.status, data: await response.json() }
          throw error
        }

        return response.json()
      } catch (error) {
        handleApiError(error, { showToast, onError })
        throw error
      }
    },
    onSuccess: (data) => {
      if (successMessage) {
        showSuccessToast(successMessage)
      }
      onSuccess?.(data)
    },
    onError: (error) => {
      onError?.(error)
    },
    ...mutationOptions,
  })
}

/**
 * Custom hook for manual API calls with comprehensive error handling
 * @param {Object} options - Configuration options
 * @returns {Object} - Api call utilities
 */
export function useApi(options = {}) {
  const {
    showToast = true,
    showLoadingToast = false,
  } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = useCallback(async (endpoint, config = {}) => {
    const {
      method = 'GET',
      data = null,
      onSuccess = null,
      onError = null,
      successMessage = null,
      loadingMessage = null,
    } = config

    setLoading(true)
    setError(null)

    let toastId = null

    try {
      if (showLoadingToast && loadingMessage) {
        toastId = showLoadingToast(loadingMessage)
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(data && { body: JSON.stringify(data) }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const error = new Error(errorData.error || 'API Error')
        error.response = { status: response.status, data: errorData }
        throw error
      }

      const result = await response.json()

      if (showToast && successMessage) {
        if (toastId) {
          updateToast(toastId, successMessage, 'success')
        }
      }

      onSuccess?.(result)
      return result
    } catch (err) {
      const handledError = handleApiError(err, {
        showToast,
        onError,
      })

      if (toastId) {
        dismissToast(toastId)
      }

      setError(handledError)
      return null
    } finally {
      setLoading(false)
    }
  }, [showToast, showLoadingToast])

  return {
    call,
    loading,
    error,
    clearError: () => setError(null),
  }
}

/**
 * Hook for form submission with API call
 * @param {Function} submitFn - Form submit function
 * @param {Object} options - Configuration options
 * @returns {Object} - Form submission utilities
 */
export function useFormSubmit(submitFn, options = {}) {
  const {
    onSuccess = null,
    onError = null,
    successMessage = 'Success!',
  } = options

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const submit = useCallback(async (formData) => {
    setLoading(true)
    setErrors({})

    try {
      const result = await submitFn(formData)

      if (successMessage) {
        showSuccessToast(successMessage)
      }

      onSuccess?.(result)
      return result
    } catch (error) {
      const handledError = handleApiError(error, { showToast: true })

      // Handle validation errors
      if (handledError.statusCode === 400 && typeof error.response?.data?.details === 'object') {
        setErrors(error.response.data.details)
      }

      onError?.(handledError)
      return null
    } finally {
      setLoading(false)
    }
  }, [submitFn, onSuccess, onError, successMessage])

  return {
    submit,
    loading,
    errors,
    clearErrors: () => setErrors({}),
  }
}

export default {
  useApiQuery,
  useApiMutation,
  useApi,
  useFormSubmit,
}
