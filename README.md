# 🚀 LeetcodeAI - Your Personal Competitive Programming Coach

> An intelligent platform to master LeetCode problems with AI-powered guidance, progress tracking, and personalized study plans.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-336791)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-brightgreen)](#license)

## ✨ Features

### 🤖 AI-Powered Coaching
- **Smart Code Analysis** - Get detailed feedback on your submissions with complexity analysis, optimization suggestions, and pattern recognition
- **Interactive AI Chat** - Ask questions about algorithms, data structures, and coding patterns
- **Code Explanation** - Understand complex solutions with AI-generated explanations
- **Revision Plans** - AI-generated personalized study schedules based on weak topics

### 📊 Progress Tracking
- **Dashboard Analytics** - Visualize your solving statistics with charts and graphs
- **Topic Mastery** - Track your strength in different algorithmic topics
- **Difficulty Progression** - Monitor Easy → Medium → Hard problem solving progress
- **Submission History** - Keep track of all your submissions with detailed metrics

### 🔗 Integrations
- **LeetCode Sync** - Automatically sync your LeetCode profile and problems
- **GitHub Integration** - Connect your GitHub for repository stats and insights
- **OAuth Authentication** - Seamless login with Google or GitHub

### 🎯 Personalization
- **Problem Bookmarks** - Save problems for later review
- **Custom Study Plans** - Generate revision schedules tailored to your goals
- **Weak Topic Focus** - Identify and focus on challenging topics
- **User Preferences** - Customize notifications and settings

### 🔒 Security & Reliability
- JWT-based authentication with refresh tokens
- CSRF protection
- Rate limiting on sensitive endpoints
- Audit logging of user actions
- Secure password reset with token validation

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **AI**: OpenAI API
- **Authentication**: Passport.js (JWT, OAuth)
- **Validation**: Zod
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 15+
- Redis
- OpenAI API key (optional, for AI features)
- GitHub OAuth credentials (optional)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd LeetcodeAI
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run db:generate
npm run db:push
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 📖 Documentation

- [Setup Guide](./SETUP.md) - Detailed installation and configuration instructions
- [API Documentation](./API_DOCUMENTATION.md) - Complete API endpoint reference
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute to the project
- [Architecture](./docs/ARCHITECTURE.md) - System design and structure

## 🎮 Usage

### For Learners
1. Sign up or login with Google/GitHub
2. Connect your LeetCode account
3. Browse and filter problems by difficulty and topic
4. Submit solutions for AI-powered analysis
5. Chat with AI coach for guidance
6. Track progress on your dashboard
7. Create revision plans for weak topics

### For Developers
See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup and development guidelines.

## 🔑 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/leetcoach_ai"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
SESSION_SECRET="your-session-secret"

# API
PORT=5000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
FRONTEND_URL="http://localhost:5173"

# OpenAI
OPENAI_API_KEY="sk-..."

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# GitHub OAuth
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_CALLBACK_URL="http://localhost:5000/api/auth/github/callback"
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (DB, Redis, Passport, Swagger)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic (AI, LeetCode, GitHub, Sync)
│   ├── utils/           # Utilities (logger, cache, audit, validators)
│   ├── validators/      # Zod validation schemas
│   └── index.js         # Entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.js          # Database seeding
│   └── migrations/      # Database migrations
└── uploads/             # User uploads (avatars)

frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Route pages
│   ├── services/        # API service layer
│   ├── stores/          # Zustand state management
│   ├── hooks/           # Custom React hooks
│   ├── constants/       # App constants
│   └── utils/           # Utility functions
├── public/              # Static assets
└── vite.config.js       # Vite configuration
```

## 📊 Database Schema

The application uses 13 interconnected Prisma models:

- **User** - User accounts and authentication
- **Problem** - LeetCode problems metadata
- **UserProblem** - Problems solved by users
- **Submission** - Code submission history
- **Conversation & Message** - AI chat history
- **RevisionPlan & RevisionItem** - Study plans
- **WeakTopic** - Topic strength tracking
- **Analytics** - User statistics
- **Bookmark** - Saved problems
- **Notification** - User notifications
- **RefreshToken** - JWT refresh tokens
- **PasswordResetToken** - Password reset management
- **AuditLog** - Activity logging

See schema in [backend/prisma/schema.prisma](./backend/prisma/schema.prisma)

## 🔄 API Endpoints Overview

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/github` - GitHub OAuth login

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get detailed analytics
- `GET /api/dashboard/weak-topics` - Get weak topics

### Problems
- `GET /api/problems` - List problems with filters
- `GET /api/problems/topics` - Get all available topics

### Submissions
- `GET /api/submissions` - List user submissions
- `POST /api/submissions/analyze` - Analyze code submission
- `POST /api/submissions/detect-pattern` - Detect coding patterns

### AI Coach
- `GET /api/ai/conversations` - List conversations
- `POST /api/ai/conversations` - Create conversation
- `POST /api/ai/chat` - Send message
- `POST /api/ai/chat/stream` - Stream AI response
- `POST /api/ai/revision-plan` - Generate revision plan
- `POST /api/ai/explain` - Explain code

### LeetCode
- `POST /api/leetcode/connect` - Connect LeetCode account
- `POST /api/leetcode/sync` - Sync problems and submissions
- `GET /api/leetcode/status` - Check connection status

### GitHub
- `GET /api/github/repos` - List connected GitHub repos
- `GET /api/github/stats` - Get GitHub stats

For complete endpoint documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🧪 Testing

Currently, the project needs comprehensive test coverage. We're working on:
- [ ] Unit tests for services
- [ ] Integration tests for API endpoints
- [ ] Frontend component tests
- [ ] E2E tests

To contribute tests, see [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📈 Performance

- Optimized PostgreSQL queries with proper indexing
- Redis caching for frequently accessed data
- Response streaming for large AI outputs
- Frontend lazy loading with React.lazy
- Efficient state management with Zustand and React Query

## 🔐 Security Features

- **Authentication**: JWT with refresh tokens, OAuth 2.0
- **Authorization**: Role-based access control per endpoint
- **Input Validation**: Zod schemas on all API endpoints
- **CSRF Protection**: Double-submit cookie pattern
- **Rate Limiting**: 15 req/min for auth, 100 req/15min for general API
- **Audit Logging**: Track all user actions
- **Password Security**: Bcrypt hashing with salt rounds
- **Data Privacy**: Cascading deletes for user data

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Development setup
- Coding standards
- Git workflow
- Pull request process
- Issue guidelines

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🐛 Reporting Issues

Found a bug or have a feature request? Please open an issue on the [GitHub repository](https://github.com/your-repo) with:
- Clear description of the problem/feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

## 📧 Support

For questions and support:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review API documentation at `/api-docs` (Swagger UI)

## 🗺️ Roadmap

- [ ] Real-time notifications (WebSocket)
- [ ] Problem discussion forums
- [ ] Leaderboard system
- [ ] Group study sessions
- [ ] Code sharing snippets
- [ ] Mobile app (React Native)
- [ ] ML-based problem recommendations
- [ ] IDE plugin integration
- [ ] User mentorship system
- [ ] Advanced analytics

## 👥 Authors

- **Your Team** - Initial development

## 🙏 Acknowledgments

- LeetCode for problem data
- OpenAI for AI capabilities
- GitHub for OAuth and repo data
- All contributors and supporters

---

**Happy Coding! 🎉**

For more information, start with [SETUP.md](./SETUP.md) for installation or [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference.
