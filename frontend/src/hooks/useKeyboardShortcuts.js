import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SHORTCUTS = [
  { key: '/', description: 'Focus search', action: 'focusSearch' },
  { key: 'Escape', description: 'Close modal/dropdown', action: 'close' },
  { key: 'g', then: 'd', description: 'Go to Dashboard', path: '/dashboard' },
  { key: 'g', then: 'p', description: 'Go to Problems', path: '/problems' },
  { key: 'g', then: 's', description: 'Go to Submissions', path: '/submissions' },
  { key: 'g', then: 'a', description: 'Go to AI Coach', path: '/ai-coach' },
  { key: 'g', then: 'h', description: 'Go to GitHub', path: '/github' },
  { key: 'g', then: 'r', description: 'Go to Revision Plan', path: '/revision-plan' },
  { key: 'g', then: 'w', description: 'Go to Weak Topics', path: '/weak-topics' },
  { key: 'g', then: 't', description: 'Go to Settings', path: '/settings' },
]

let pendingKey = null
let pendingTimeout = null

export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      const target = e.target
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (e.key === 'Escape') {
        document.dispatchEvent(new CustomEvent('shortcut:close'))
        return
      }

      if (e.key === '/' && !isInput) {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('shortcut:focusSearch'))
        return
      }

      if (!isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (pendingKey === 'g') {
          clearTimeout(pendingTimeout)
          pendingKey = null
          const shortcut = SHORTCUTS.find((s) => s.key === 'g' && s.then === e.key)
          if (shortcut?.path) {
            navigate(shortcut.path)
          }
          return
        }

        if (e.key === 'g') {
          pendingKey = 'g'
          pendingTimeout = setTimeout(() => { pendingKey = null }, 1000)
          return
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])
}

export { SHORTCUTS }
