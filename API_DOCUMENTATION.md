# 📚 API Documentation - LeetcodeAI

Complete reference for all API endpoints, authentication, and usage examples.

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://api.leetcode-ai.com`

## API Versioning
All endpoints use the `/api` prefix and are currently on v1 (implicit).

## Authentication

### JWT Token Flow

1. **Sign Up** → Get JWT token + Refresh token
2. **Login** → Get JWT token + Refresh token  
3. **Use JWT** → Send in `Authorization: Bearer <token>` header
4. **Token Expires** → Use refresh token to get new JWT
5. **Logout** → Invalidate refresh token

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
X-CSRF-Token: <token-from-/api/csrf-token> (required for state-changing operations)
```

### Token Refresh
When JWT expires (default 7 days):
```bash
POST /api/auth/refresh
Cookie: refreshToken=<refresh-token>
```

Returns new JWT token.

## Response Format

### Success Response
```json
{
  "data": { /* endpoint-specific data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* validation errors if applicable */ }
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry, etc.)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

- **Auth Endpoints**: 15 requests per minute per IP
- **General API**: 100 requests per 15 minutes per user
- **Headers** returned:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Authentication Endpoints

### 1. Sign Up
Create a new user account.

```
POST /api/auth/signup
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response** (201):
```json
{
  "user": {
    "id": "cuid-123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": null,
    "createdAt": "2026-08-14T10:00:00Z"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Validation**:
- Email must be valid format and unique
- Password must be minimum 6 characters
- Name is required

---

### 2. Login
Authenticate existing user.

```
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "user": { /* user object */ },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### 3. Google OAuth
Initiate Google login.

```
GET /api/auth/google
```

**Redirects to**: Google consent screen

**Callback**: Redirects to `/api/auth/google/callback?code=...`

---

### 4. GitHub OAuth
Initiate GitHub login.

```
GET /api/auth/github
```

**Redirects to**: GitHub authorization page

**Callback**: Redirects to `/api/auth/github/callback?code=...`

---

### 5. Set Password
Set password for OAuth users who haven't set one.

```
POST /api/auth/set-password
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "password": "NewSecurePass123!"
}
```

**Response** (200):
```json
{
  "message": "Password set successfully"
}
```

---

### 6. Forgot Password
Request password reset link.

```
POST /api/auth/forgot-password
```

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200):
```json
{
  "message": "Password reset link sent to your email"
}
```

---

### 7. Reset Password
Reset password with token from email.

```
POST /api/auth/reset-password
```

**Request Body**:
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
```

**Response** (200):
```json
{
  "message": "Password reset successfully"
}
```

---

### 8. Refresh Token
Get new JWT token using refresh token.

```
POST /api/auth/refresh
Cookie: refreshToken=<refresh-token>
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGc..."
}
```

---

### 9. Logout
Invalidate refresh token.

```
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

---

### 10. Get CSRF Token
Get CSRF token for state-changing operations.

```
GET /api/csrf-token
```

**Response** (200):
```json
{
  "csrfToken": "csrf-token-string"
}
```

---

## User Profile Endpoints

### 1. Get Profile
Retrieve authenticated user's profile.

```
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "user": {
    "id": "cuid-123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "/uploads/avatars/user-avatar.jpg",
    "googleId": null,
    "githubId": "github-123",
    "githubToken": "github-token",
    "leetcodeUsername": "john_doe",
    "lastSyncedAt": "2026-08-14T10:00:00Z",
    "createdAt": "2026-08-14T10:00:00Z"
  }
}
```

---

### 2. Update Profile
Update user profile information.

```
PUT /api/auth/profile
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "name": "John Updated",
  "email": "newemail@example.com"
}
```

**Response** (200):
```json
{
  "user": { /* updated user object */ }
}
```

---

### 3. Upload Avatar
Upload user avatar image.

```
POST /api/auth/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data**:
```
file: <image-file> (jpg, png, gif, webp, max 2MB)
```

**Response** (200):
```json
{
  "avatarUrl": "/uploads/avatars/user-avatar-1692028800000.jpg"
}
```

---

### 4. Delete Account
Permanently delete user account and all associated data.

```
DELETE /api/auth/account
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "password": "current-password-confirmation"
}
```

**Response** (200):
```json
{
  "message": "Account deleted successfully"
}
```

---

## Dashboard Endpoints

### 1. Get Dashboard
Retrieve dashboard statistics and charts data.

```
GET /api/dashboard
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "user": { /* user object */ },
  "stats": {
    "totalSolved": 145,
    "easy": 89,
    "medium": 42,
    "hard": 14,
    "totalSubmissions": 312,
    "acceptanceRate": 78
  },
  "topicDistribution": [
    { "topic": "Array", "count": 32 },
    { "topic": "Hash Table", "count": 28 },
    { "topic": "Dynamic Programming", "count": 22 }
  ],
  "dailyActivity": [
    { "date": "2026-08-13", "count": 3 },
    { "date": "2026-08-14", "count": 5 }
  ],
  "recentProblems": [ /* last 5 solved problems */ ]
}
```

---

### 2. Get Analytics
Detailed analytics and statistics.

```
GET /api/dashboard/analytics
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "totalProblems": 3000,
  "problemsSolved": 145,
  "solveRate": 4.83,
  "averageAcceptanceRate": 68.5,
  "submissionStats": {
    "totalSubmissions": 312,
    "acceptedSubmissions": 145,
    "successRate": 46.47
  },
  "languageStats": {
    "JavaScript": { "count": 89, "percentage": 62.2 },
    "Python": { "count": 42, "percentage": 29.2 }
  }
}
```

---

### 3. Get Weak Topics
Identify topics where user needs improvement.

```
GET /api/dashboard/weak-topics
Authorization: Bearer <token>
```

**Query Parameters**:
- `limit`: Number of topics to return (default: 10)
- `sort`: "strength" or "count" (default: "strength")

**Response** (200):
```json
{
  "weakTopics": [
    {
      "id": "weak-topic-123",
      "topic": "Graph",
      "strengthScore": 45.5,
      "problemCount": 8,
      "createdAt": "2026-08-14T10:00:00Z"
    }
  ]
}
```

---

### 4. Get Difficulty Progress
Track progress across difficulty levels.

```
GET /api/dashboard/difficulty-progress
Authorization: Bearer <token>
```

**Query Parameters**:
- `days`: Number of days to analyze (default: 30)

**Response** (200):
```json
{
  "progression": [
    {
      "date": "2026-08-14",
      "easy": 2,
      "medium": 1,
      "hard": 0
    }
  ]
}
```

---

## Problem Endpoints

### 1. List Problems
Get all available problems with filtering.

```
GET /api/problems
Authorization: Bearer <token>
```

**Query Parameters**:
```
?difficulty=Easy&difficulty=Medium
&topic=Array
&status=solved&status=attempted
&sort=recent&page=1&limit=20
```

**Response** (200):
```json
{
  "problems": [
    {
      "id": "problem-123",
      "leetcodeId": 1,
      "title": "Two Sum",
      "titleSlug": "two-sum",
      "difficulty": "Easy",
      "topic": "Array",
      "tags": ["Array", "Hash Table"],
      "acceptance": 49.2
    }
  ],
  "total": 3000,
  "page": 1,
  "limit": 20
}
```

---

### 2. Get Problem Topics
Get all available topics.

```
GET /api/problems/topics
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "topics": [
    "Array",
    "Hash Table",
    "Dynamic Programming",
    "Tree",
    "Graph",
    "Binary Search",
    "Stack",
    "Linked List"
  ]
}
```

---

## Submission Endpoints

### 1. Get Submissions
Retrieve user's code submissions.

```
GET /api/submissions
Authorization: Bearer <token>
```

**Query Parameters**:
- `status`: "Accepted", "Wrong Answer", etc.
- `language`: Programming language
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

**Response** (200):
```json
{
  "submissions": [
    {
      "id": "sub-123",
      "problemId": "problem-1",
      "code": "function twoSum(nums, target) { /* ... */ }",
      "language": "javascript",
      "runtime": 68,
      "memory": 42.1,
      "status": "Accepted",
      "submissionTime": "2026-08-14T10:00:00Z",
      "problem": { /* problem object */ }
    }
  ]
}
```

---

### 2. Analyze Submission
Get AI-powered code analysis.

```
POST /api/submissions/analyze
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "code": "function twoSum(nums, target) { /* ... */ }",
  "language": "javascript",
  "problemTitle": "Two Sum"
}
```

**Response** (200):
```json
{
  "analysis": {
    "timeComplexity": "O(n) - Single pass through array",
    "spaceComplexity": "O(n) - Hash map stores elements",
    "optimizations": [
      "Consider edge cases with duplicates",
      "Could use two pointers if sorted"
    ],
    "readability": "Code is clean and readable",
    "edgeCases": [
      "Empty array",
      "Single element",
      "No valid solution"
    ],
    "pattern": "Hash Map Lookup",
    "difficulty": "Easy",
    "overallScore": 85
  }
}
```

---

### 3. Detect Pattern
Identify coding patterns in submission.

```
POST /api/submissions/detect-pattern
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "code": "function twoSum(nums, target) { /* ... */ }",
  "language": "javascript"
}
```

**Response** (200):
```json
{
  "patterns": [
    {
      "name": "Hash Map",
      "confidence": 95,
      "description": "Using hash map for O(1) lookups"
    },
    {
      "name": "Array Traversal",
      "confidence": 90,
      "description": "Single pass iteration"
    }
  ]
}
```

---

## AI Coach Endpoints

### 1. Get Conversations
List all AI chat conversations.

```
GET /api/ai/conversations
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "conversations": [
    {
      "id": "conv-123",
      "title": "Help with Two Sum",
      "messages": [ /* message objects */ ],
      "createdAt": "2026-08-14T10:00:00Z",
      "updatedAt": "2026-08-14T10:30:00Z"
    }
  ]
}
```

---

### 2. Create Conversation
Start a new AI chat.

```
POST /api/ai/conversations
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "title": "Help with Two Sum"
}
```

**Response** (201):
```json
{
  "conversation": {
    "id": "conv-123",
    "title": "Help with Two Sum",
    "messages": [],
    "createdAt": "2026-08-14T10:00:00Z"
  }
}
```

---

### 3. Send Message
Send message to AI coach and get response.

```
POST /api/ai/chat
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "conversationId": "conv-123",
  "content": "How do I solve the two sum problem efficiently?"
}
```

**Response** (200):
```json
{
  "message": {
    "id": "msg-456",
    "conversationId": "conv-123",
    "role": "assistant",
    "content": "The two sum problem can be solved efficiently using a hash map...",
    "createdAt": "2026-08-14T10:01:00Z"
  }
}
```

---

### 4. Stream Chat Response
Get streaming AI response (Server-Sent Events).

```
POST /api/ai/chat/stream
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "conversationId": "conv-123",
  "content": "Explain the algorithm step by step"
}
```

**Response**: Text stream
```
data: The two sum problem
data: can be solved using
data: a hash map approach...
```

---

### 5. Generate Revision Plan
Create AI-powered study plan for weak topics.

```
POST /api/ai/revision-plan
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "type": "week",
  "focusTopics": ["Graph", "Dynamic Programming"]
}
```

**Response** (201):
```json
{
  "revisionPlan": {
    "id": "plan-123",
    "type": "week",
    "startDate": "2026-08-14T00:00:00Z",
    "items": [
      {
        "id": "item-1",
        "day": 1,
        "topic": "Graph Basics",
        "problems": ["problem-1", "problem-2"],
        "estimatedTime": 120,
        "completed": false
      }
    ]
  }
}
```

---

### 6. Explain Code
Get AI explanation for code snippet.

```
POST /api/ai/explain
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "code": "function dfs(node) { /* ... */ }",
  "language": "javascript"
}
```

**Response** (200):
```json
{
  "explanation": "This function implements depth-first search (DFS). It recursively visits each node..."
}
```

---

## LeetCode Integration Endpoints

### 1. Get LeetCode Status
Check if user has connected LeetCode account.

```
GET /api/leetcode/status
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "connected": true,
  "username": "john_doe",
  "lastSyncedAt": "2026-08-14T10:00:00Z"
}
```

---

### 2. Connect LeetCode Account
Link user's LeetCode account.

```
POST /api/leetcode/connect
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "username": "john_doe"
}
```

**Response** (200):
```json
{
  "message": "LeetCode account connected and synced",
  "profile": {
    "username": "john_doe",
    "realName": "John Doe",
    "avatar": "https://...",
    "problemsSolved": 145,
    "totalSubmissions": 312
  },
  "syncedCount": 145
}
```

---

### 3. Sync LeetCode Data
Manually trigger sync of problems and submissions.

```
POST /api/leetcode/sync
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Response** (200):
```json
{
  "message": "Sync completed",
  "problemsSynced": 45,
  "submissionsSynced": 78
}
```

---

### 4. Disconnect LeetCode
Unlink LeetCode account.

```
POST /api/leetcode/disconnect
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Response** (200):
```json
{
  "message": "LeetCode account disconnected"
}
```

---

## Bookmark Endpoints

### 1. Get Bookmarks
List all bookmarked problems.

```
GET /api/bookmarks
Authorization: Bearer <token>
```

**Query Parameters**:
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

**Response** (200):
```json
{
  "bookmarks": [
    {
      "id": "bookmark-123",
      "problemId": "problem-1",
      "note": "Important pattern - use hash map",
      "problem": { /* problem object */ },
      "createdAt": "2026-08-14T10:00:00Z"
    }
  ]
}
```

---

### 2. Add Bookmark
Bookmark a problem.

```
POST /api/bookmarks
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "problemId": "problem-1",
  "note": "Review for interview prep"
}
```

**Response** (201):
```json
{
  "bookmark": { /* bookmark object */ }
}
```

---

### 3. Toggle Bookmark
Add or remove bookmark.

```
POST /api/bookmarks/toggle
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Request Body**:
```json
{
  "problemId": "problem-1"
}
```

**Response** (200):
```json
{
  "bookmarked": true
}
```

---

### 4. Remove Bookmark
Delete a bookmark.

```
DELETE /api/bookmarks/:id
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Response** (200):
```json
{
  "message": "Bookmark removed"
}
```

---

## Notification Endpoints

### 1. Get Notifications
Retrieve user notifications.

```
GET /api/notifications
Authorization: Bearer <token>
```

**Query Parameters**:
- `limit`: Number of results (default: 20)
- `unreadOnly`: Show only unread (default: false)

**Response** (200):
```json
{
  "notifications": [
    {
      "id": "notif-123",
      "type": "problem_sync",
      "title": "LeetCode Sync Complete",
      "message": "Successfully synced 45 new problems",
      "read": false,
      "createdAt": "2026-08-14T10:00:00Z"
    }
  ]
}
```

---

### 2. Get Unread Count
Get number of unread notifications.

```
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "unreadCount": 5
}
```

---

### 3. Mark as Read
Mark notification as read.

```
PUT /api/notifications/:id/read
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Response** (200):
```json
{
  "message": "Marked as read"
}
```

---

### 4. Mark All as Read
Mark all notifications as read.

```
PUT /api/notifications/read-all
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Response** (200):
```json
{
  "message": "All notifications marked as read"
}
```

---

## GitHub Integration Endpoints

### 1. Get Connection Status
Check GitHub connection status.

```
GET /api/github/status
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "connected": true,
  "username": "john-doe",
  "avatar": "https://..."
}
```

---

### 2. Get Repositories
List connected GitHub repositories.

```
GET /api/github/repos
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "repos": [
    {
      "name": "leetcode-solutions",
      "url": "https://github.com/john-doe/leetcode-solutions",
      "stars": 45,
      "forks": 12,
      "language": "JavaScript"
    }
  ]
}
```

---

### 3. Get Repository Stats
Get detailed statistics for a repository.

```
GET /api/github/repo/:owner/:repo
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "stats": {
    "stars": 45,
    "forks": 12,
    "watchers": 8,
    "language": "JavaScript",
    "commits": 234
  }
}
```

---

### 4. Disconnect GitHub
Unlink GitHub account.

```
POST /api/github/disconnect
Authorization: Bearer <token>
X-CSRF-Token: <token>
```

**Response** (200):
```json
{
  "message": "GitHub account disconnected"
}
```

---

## Error Handling

### Common Error Responses

#### 400 - Validation Error
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  }
}
```

#### 401 - Unauthorized
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

#### 429 - Rate Limited
```json
{
  "error": "Too many requests",
  "code": "RATE_LIMITED",
  "retryAfter": 60
}
```

#### 500 - Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

---

## Best Practices

1. **Store Tokens Securely**
   - Use httpOnly cookies for refresh tokens
   - Store JWT in memory or sessionStorage (never localStorage for security)

2. **Handle Token Refresh**
   ```javascript
   // Intercept 401 responses and refresh token
   if (response.status === 401) {
     const newToken = await refreshToken();
     // Retry original request with new token
   }
   ```

3. **Implement Rate Limiting**
   - Check `X-RateLimit-Remaining` header
   - Respect `X-RateLimit-Reset` time
   - Queue requests if approaching limit

4. **Validate Input**
   - Validate data on frontend before sending
   - Never trust server responses blindly
   - Sanitize displayed user content

5. **Error Handling**
   - Always handle error responses
   - Show user-friendly error messages
   - Log errors for debugging

---

## SDKs & Libraries

Consider using a client library for easier integration:

- **JavaScript/TypeScript**: Axios, Fetch API, or dedicated SDK
- **Python**: Requests library
- **Go**: Standard HTTP library

---

## Support

For issues or questions:
- Check the [README](./README.md)
- Review error messages and response codes
- Open an issue on GitHub
- Check [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Last Updated**: August 14, 2026

For the latest API changes, check the repository changelog.
