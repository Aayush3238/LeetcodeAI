import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(minutes) {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
}

export function getDifficultyColor(difficulty) {
  const colors = { Easy: 'text-green-400', Medium: 'text-yellow-400', Hard: 'text-red-400' }
  return colors[difficulty] || 'text-dark-400'
}

export function getDifficultyBg(difficulty) {
  const bgs = { Easy: 'bg-green-400/10', Medium: 'bg-yellow-400/10', Hard: 'bg-red-400/10' }
  return bgs[difficulty] || 'bg-dark-800'
}
