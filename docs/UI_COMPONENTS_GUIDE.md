# 🎨 UI Components & Styling Guide

Complete guide to using LeetcodeAI's UI components and patterns.

## Table of Contents
1. [Components Overview](#components-overview)
2. [Form Components](#form-components)
3. [State Components](#state-components)
4. [Error Handling](#error-handling)
5. [Styling Conventions](#styling-conventions)
6. [Examples](#examples)

## Components Overview

### Imported From `src/components/ui`

All components are exported from `src/components/ui/index.jsx`:

```javascript
import {
  // Core Components
  Card, GlassCard, Button, Input, Badge, Skeleton, StatCard, PageHeader,
  
  // State Components
  EmptyState, ErrorCard, NoResultsFound, SkeletonGrid, SkeletonList,
  LoadingSpinner, ContentLoader, SuccessBanner, WarningBanner,
  
  // Form Components
  FormField, TextAreaField, SelectField, CheckboxField, ErrorSummary,
} from '../components/ui'
```

---

## Form Components

### FormField Component

Advanced text input field with validation, error display, and icons.

**Features:**
- Real-time validation feedback
- Password visibility toggle (for password inputs)
- Success/error indicators
- Custom icons
- Accessibility features

**Usage:**

```jsx
import { FormField } from '../components/ui'
import { Mail } from 'lucide-react'
import { useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(null)
  const [emailSuccess, setEmailSuccess] = useState(false)

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    
    // Real-time validation
    if (value && !value.includes('@')) {
      setEmailError('Please enter a valid email')
      setEmailSuccess(false)
    } else if (value) {
      setEmailError(null)
      setEmailSuccess(true)
    } else {
      setEmailError(null)
      setEmailSuccess(false)
    }
  }

  return (
    <FormField
      label="Email Address"
      name="email"
      type="email"
      placeholder="user@example.com"
      value={email}
      onChange={handleEmailChange}
      error={emailError}
      success={emailSuccess}
      icon={Mail}
      hint="We'll never share your email"
      required
    />
  )
}
```

**Props:**
- `label` (string) - Field label
- `name` (string) - Input name
- `type` (string) - Input type (text, email, password, etc.)
- `placeholder` (string) - Placeholder text
- `value` (any) - Current value
- `onChange` (function) - Change handler
- `onBlur` (function) - Blur handler
- `error` (string) - Error message
- `success` (boolean) - Show success state
- `hint` (string) - Helper text
- `required` (boolean) - Show required indicator
- `disabled` (boolean) - Disable input
- `icon` (ReactComponent) - Left icon from lucide-react
- `autoComplete` (string) - Autocomplete attribute
- `className` (string) - Additional CSS classes

---

### TextAreaField Component

Multi-line text input with character count and validation.

```jsx
import { TextAreaField } from '../components/ui'

export function CommentForm() {
  const [comment, setComment] = useState('')
  const maxChars = 500

  return (
    <TextAreaField
      label="Your Comment"
      name="comment"
      placeholder="Share your thoughts..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      rows={4}
      maxLength={maxChars}
      hint={`${maxChars - comment.length} characters remaining`}
      required
    />
  )
}
```

**Props:**
- All FormField props plus:
- `rows` (number) - Number of rows
- `maxLength` (number) - Maximum characters
- Shows character count at bottom-right

---

### SelectField Component

Dropdown select input with validation.

```jsx
import { SelectField } from '../components/ui'

export function DifficultyFilter() {
  const [difficulty, setDifficulty] = useState('')

  return (
    <SelectField
      label="Problem Difficulty"
      name="difficulty"
      value={difficulty}
      onChange={(e) => setDifficulty(e.target.value)}
      options={[
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
      ]}
      placeholder="Select difficulty..."
    />
  )
}
```

**Props:**
- All FormField props plus:
- `options` (array) - Array of `{ label, value }` objects

---

### CheckboxField Component

Checkbox input with label and validation.

```jsx
import { CheckboxField } from '../components/ui'

export function TermsAgreement() {
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreed) {
      setError('You must agree to the terms')
      return
    }
    // Submit form
  }

  return (
    <form onSubmit={handleSubmit}>
      <CheckboxField
        label="I agree to the Terms and Conditions"
        name="terms"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        error={error}
        required
      />
      <button type="submit">Continue</button>
    </form>
  )
}
```

---

### ErrorSummary Component

Display all form validation errors in one place.

```jsx
import { ErrorSummary, FormField } from '../components/ui'
import { useState } from 'react'

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        const data = await response.json()
        setErrors(data.details || {})
        return
      }
      
      // Success
    } catch (error) {
      setErrors({ general: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ErrorSummary errors={errors} />
      
      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
      />
      
      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
      />
      
      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
      />
      
      <button type="submit">Sign Up</button>
    </form>
  )
}
```

---

## State Components

### EmptyState Component

Display when no data is available.

```jsx
import { EmptyState } from '../components/ui'
import { BookmarkIcon } from 'lucide-react'

export function BookmarkList({ bookmarks }) {
  if (bookmarks.length === 0) {
    return (
      <EmptyState
        icon={BookmarkIcon}
        title="No Bookmarks Yet"
        description="Start bookmarking problems to save them for later"
        action={
          <button className="px-4 py-2 bg-primary-600 rounded text-white">
            Browse Problems
          </button>
        }
      />
    )
  }

  return (
    <div>
      {/* Bookmarks list */}
    </div>
  )
}
```

---

### ErrorCard Component

Display errors in content areas with retry option.

```jsx
import { ErrorCard } from '../components/ui'

export function DashboardSection() {
  const { data, error, refetch } = useQuery(['dashboard'], fetchDashboard)

  if (error) {
    return (
      <ErrorCard
        title="Failed to Load Dashboard"
        message="We couldn't load your dashboard data. Please try again."
        onRetry={refetch}
      />
    )
  }

  return <div>{/* Dashboard content */}</div>
}
```

---

### LoadingSpinner Component

Show loading state with spinner.

```jsx
import { LoadingSpinner } from '../components/ui'

export function DataFetching() {
  const [loading, setLoading] = useState(true)

  return (
    <div>
      {loading ? (
        <LoadingSpinner 
          size="lg" 
          text="Loading your problems..." 
        />
      ) : (
        <div>{/* Content */}</div>
      )}
    </div>
  )
}
```

**Props:**
- `size` - 'sm', 'md', 'lg'
- `text` - Loading message

---

### SkeletonList & SkeletonGrid

Loading skeletons for data grids.

```jsx
import { SkeletonList, SkeletonGrid } from '../components/ui'
import { useQuery } from '@tanstack/react-query'

export function ProblemsPage() {
  const { data, isLoading } = useQuery(['problems'], fetchProblems)

  if (isLoading) {
    return <SkeletonGrid count={6} columns={3} />
  }

  return (
    <div className="grid grid-cols-3">
      {data.problems.map(problem => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  )
}
```

---

### SuccessBanner & WarningBanner

Dismissible banners for notifications.

```jsx
import { SuccessBanner, WarningBanner } from '../components/ui'
import { useState } from 'react'

export function NotificationExample() {
  const [showSuccess, setShowSuccess] = useState(true)
  const [showWarning, setShowWarning] = useState(true)

  return (
    <div>
      {showSuccess && (
        <SuccessBanner
          message="Your changes have been saved successfully!"
          onDismiss={() => setShowSuccess(false)}
          autoHide={true}
          duration={5000}
        />
      )}

      {showWarning && (
        <WarningBanner
          message="Your session will expire in 5 minutes"
          onDismiss={() => setShowWarning(false)}
          action={
            <button className="text-sm px-2 py-1 bg-yellow-600 rounded">
              Stay Logged In
            </button>
          }
        />
      )}
    </div>
  )
}
```

---

## Error Handling

### Using Global Error Handler

```javascript
import { handleApiError, showSuccessToast } from '../utils/errorHandler'

async function submitForm(data) {
  try {
    const response = await fetch('/api/problems/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = new Error('Submission failed')
      error.response = { status: response.status, data: await response.json() }
      throw error
    }

    showSuccessToast('Submission received! AI will analyze it shortly.')
    return response.json()
  } catch (error) {
    handleApiError(error, {
      showToast: true,
      logError: true,
      onError: (err) => {
        console.log('Custom error handler:', err)
      }
    })
  }
}
```

### Using useApi Hook

```jsx
import { useApi } from '../hooks/useApi'
import { FormField } from '../components/ui'
import { useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { call, loading, error, clearError } = useApi()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    await call('/api/auth/login', {
      method: 'POST',
      data: { email, password },
      successMessage: 'Welcome back!',
      loadingMessage: 'Logging in...',
      onSuccess: (data) => {
        // Handle successful login
        window.location.href = '/dashboard'
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error?.message}
        required
      />
      
      <FormField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error?.message}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

---

## Styling Conventions

### Color Classes

```
Primary: text-primary-400, bg-primary-600, border-primary-500
Success: text-green-400, bg-green-500/10
Warning: text-yellow-400, bg-yellow-500/10
Error: text-red-400, bg-red-500/10
Info: text-blue-400, bg-blue-500/10
```

### Common Patterns

```jsx
// Card with padding
<div className="card p-6">Content</div>

// Rounded button
<button className="px-4 py-2 rounded font-medium">Action</button>

// Text field error state
<input className="border-red-500/50 focus:ring-red-500" />

// Disabled state
<button disabled className="opacity-50 cursor-not-allowed">Disabled</button>

// Loading animation
<div className="animate-spin border-2 border-primary-500 border-t-transparent rounded-full" />
```

---

## Examples

### Complete Form Example

```jsx
import { useState } from 'react'
import {
  FormField,
  TextAreaField,
  SelectField,
  CheckboxField,
  ErrorSummary,
  LoadingSpinner,
} from '../components/ui'
import { useFormSubmit } from '../hooks/useApi'

export function EditProfileForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    topic: user.topic || '',
    subscribed: user.subscribed || false,
  })

  const { submit, loading, errors, clearErrors } = useFormSubmit(
    async (data) => {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const err = await response.json()
        throw err
      }
      
      return response.json()
    },
    {
      successMessage: 'Profile updated successfully!',
      onSuccess,
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearErrors()
    await submit(formData)
  }

  if (loading) return <LoadingSpinner text="Updating profile..." />

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <ErrorSummary errors={errors} />

      <FormField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />

      <TextAreaField
        label="Bio"
        name="bio"
        placeholder="Tell us about yourself..."
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        error={errors.bio}
        rows={3}
        maxLength={200}
      />

      <SelectField
        label="Favorite Topic"
        name="topic"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
        error={errors.topic}
        options={[
          { label: 'Array', value: 'array' },
          { label: 'Tree', value: 'tree' },
          { label: 'Graph', value: 'graph' },
        ]}
      />

      <CheckboxField
        label="Subscribe to weekly tips"
        name="subscribed"
        checked={formData.subscribed}
        onChange={(e) => setFormData({ ...formData, subscribed: e.target.checked })}
      />

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
```

---

## Best Practices

1. **Always show error states** - Use validation feedback
2. **Provide loading feedback** - Use LoadingSpinner or skeletons
3. **Use appropriate icons** - From lucide-react library
4. **Handle edge cases** - Empty states, errors, loading
5. **Keep forms accessible** - Use proper labels and hints
6. **Validate on the fly** - Real-time feedback
7. **Group related fields** - Use spacing and structure
8. **Provide clear feedback** - Success messages, error messages

---

## Component Checklist

When creating new pages, include:

- [ ] Error boundary wrapping
- [ ] Loading state indicator
- [ ] Empty state fallback
- [ ] Form validation/error display
- [ ] Success notifications
- [ ] Proper accessibility (labels, etc.)
- [ ] Responsive design
- [ ] Keyboard navigation support

---

For more examples, check the `/frontend/src/pages/` directory.
