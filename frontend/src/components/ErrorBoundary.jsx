import { Component } from 'react'
import { AlertTriangle, RefreshCw, ChevronDown, Home } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      try {
        // Example: Send to error tracking service like Sentry
        console.log('Error would be sent to monitoring service:', {
          message: error.toString(),
          stack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        })
      } catch (e) {
        console.error('Failed to log error:', e)
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development'
      const errorMessage = this.state.error?.message || 'An unexpected error occurred'
      const stack = this.state.errorInfo?.componentStack || ''

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-4">
          <div className="w-full max-w-md">
            {/* Error Card */}
            <div className="bg-dark-800 border border-red-500/20 rounded-lg shadow-2xl overflow-hidden">
              {/* Error Header */}
              <div className="bg-gradient-to-r from-red-600/10 to-red-500/5 border-b border-red-500/20 px-6 py-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle size={32} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-white mb-1">Oops! Something went wrong</h1>
                    <p className="text-dark-300 text-sm">We encountered an unexpected error</p>
                  </div>
                </div>
              </div>

              {/* Error Content */}
              <div className="px-6 py-4 space-y-4">
                {/* Error Message */}
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                  <p className="text-red-300 text-sm font-mono break-words">
                    {errorMessage}
                  </p>
                </div>

                {/* Details Section (Development Only) */}
                {isDevelopment && (
                  <div className="space-y-2">
                    <button
                      onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                      className="w-full flex items-center justify-between px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded text-dark-200 text-sm transition-colors"
                    >
                      <span>Error Details</span>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {this.state.showDetails && (
                      <div className="bg-dark-900 border border-dark-700 rounded p-3 max-h-48 overflow-auto">
                        <p className="text-dark-400 text-xs font-mono whitespace-pre-wrap break-words">
                          {stack || 'No additional details available'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Help Text */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                  <p className="text-blue-300 text-xs">
                    <strong>Tip:</strong> Try refreshing the page. If the problem persists, clear your browser cache or try again later.
                  </p>
                </div>
              </div>

              {/* Error Actions */}
              <div className="bg-dark-700 px-6 py-4 border-t border-dark-600 flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded font-medium transition-colors"
                >
                  <RefreshCw size={16} /> Retry
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dark-600 hover:bg-dark-500 text-white rounded font-medium transition-colors"
                >
                  <Home size={16} /> Home
                </button>
              </div>

              {/* Footer */}
              <div className="bg-dark-800/50 px-6 py-3 border-t border-dark-700">
                <p className="text-dark-400 text-xs text-center">
                  Error ID: {Date.now()}
                </p>
              </div>
            </div>

            {/* Additional Help */}
            <div className="mt-6 text-center text-dark-400 text-sm">
              <p>Need help? Check our <a href="/docs" className="text-primary-400 hover:underline">documentation</a> or contact support.</p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
