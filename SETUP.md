# 🔧 Setup Guide - LeetcodeAI

Complete step-by-step guide to set up LeetcodeAI locally for development.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [OAuth Configuration](#oauth-configuration)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 2GB free

### Required Software

#### 1. Node.js (v18 or higher)
**Download from**: https://nodejs.org/

**Verify installation**:
```bash
node --version
npm --version
# Should show v18.0.0+ and 8.0.0+
```

#### 2. PostgreSQL (v15 or higher)
**Windows**: https://www.postgresql.org/download/windows/
**macOS**: 
```bash
brew install postgresql
```
**Linux** (Ubuntu):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**Verify installation**:
```bash
psql --version
```

#### 3. Redis
**Windows**: Download from https://github.com/microsoftarchive/redis/releases (or use WSL)
**macOS**:
```bash
brew install redis
```
**Linux** (Ubuntu):
```bash
sudo apt install redis-server
```

**Verify installation**:
```bash
redis-cli --version
```

#### 4. Git
**Download from**: https://git-scm.com/

**Verify installation**:
```bash
git --version
```

#### 5. Code Editor
Recommended: [Visual Studio Code](https://code.visualstudio.com/)

## Environment Setup

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd LeetcodeAI
```

### 2. Create Environment Files

#### Backend Environment (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Database Configuration
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/leetcoach_ai?schema=public"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
JWT_EXPIRES_IN="7d"
SESSION_SECRET="your-session-secret-minimum-32-characters"

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
FRONTEND_URL="http://localhost:5173"

# OpenAI Configuration (Optional but recommended for AI features)
OPENAI_API_KEY="sk-your-openai-api-key"

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_CALLBACK_URL="http://localhost:5000/api/auth/github/callback"
```

**Security Tips**:
- Generate a strong JWT_SECRET: Use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit `.env` to version control
- In production, use environment variable management tools

## Database Setup

### 1. Start PostgreSQL
**Windows (using pgAdmin or command line)**:
```bash
psql -U postgres
```

**macOS/Linux**:
```bash
brew services start postgresql
# or
sudo service postgresql start
```

### 2. Create Database
```bash
createdb leetcoach_ai
# or in psql:
# CREATE DATABASE leetcoach_ai;
```

**Verify**:
```bash
psql -l | grep leetcoach_ai
```

### 3. Start Redis
**Windows** (if using Redis service):
```bash
redis-server
```

**macOS/Linux**:
```bash
brew services start redis
# or
redis-server
```

**Verify**:
```bash
redis-cli ping
# Should return: PONG
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Generate Prisma Client
```bash
npm run db:generate
```

### 3. Run Database Migrations
```bash
npm run db:push
```

Or if you want to create migrations:
```bash
npm run db:migrate
```

### 4. Seed Database (Optional)
```bash
npm run db:seed
```

This populates the database with sample problems and data.

### 5. Verify Swagger Docs
```bash
npm run dev
```

Visit: http://localhost:5000/api-docs

**Expected**: Swagger UI with all API endpoints listed

### 6. Test Backend
```bash
curl http://localhost:5000/api/csrf-token
# Should return a JSON response with csrfToken
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create Frontend Environment (if needed)
Most frontend config is in `vite.config.js`. The API base URL should point to backend:
```javascript
// frontend/vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
```

### 3. Start Development Server
```bash
npm run dev
```

**Expected**: 
```
  VITE v5.0.12  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Visit: http://localhost:5173

## OAuth Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name it "LeetcodeAI")
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (OAuth consent screen):
   - User type: External
   - Add your email as test user
   - Scopes: `email`, `profile`
5. Create OAuth 2.0 ID:
   - Type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
6. Copy `Client ID` and `Client Secret` to `.env`

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: LeetcodeAI Dev
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy `Client ID` and `Client Secret` to `.env`

### OpenAI API Setup

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Go to API keys: https://platform.openai.com/api-keys
3. Create new secret key
4. Copy to `.env` as `OPENAI_API_KEY`

**Note**: OpenAI is optional. Without it, AI features will use mock responses.

## Verification

### Complete Setup Checklist

- [ ] Node.js installed and version ≥ 18
- [ ] PostgreSQL running and database created
- [ ] Redis running
- [ ] `.env` file configured with valid credentials
- [ ] Database migrations completed (`npm run db:push`)
- [ ] Backend starts without errors (`npm run dev` from backend/)
- [ ] Frontend builds and runs (`npm run dev` from frontend/)
- [ ] Can access Swagger docs: http://localhost:5000/api-docs
- [ ] Can access frontend: http://localhost:5173
- [ ] Can create account and login

### Test API Endpoint
```bash
# From backend directory, with backend running:
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

### Test Frontend Connection
1. Open http://localhost:5173
2. Click "Sign Up"
3. Create an account
4. Should redirect to dashboard

## Project Structure After Setup

```
LeetcodeAI/
├── backend/
│   ├── node_modules/
│   ├── prisma/
│   │   └── schema.prisma (✓ Migrated)
│   ├── src/
│   ├── uploads/
│   ├── .env (✓ Configured)
│   ├── package.json
│   └── logs/ (Created on first run)
├── frontend/
│   ├── node_modules/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Terminal 3 (Optional) - Database Studio
```bash
cd backend
npm run db:studio
# Opens Prisma Studio at http://localhost:5555
```

## Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**:
- Ensure PostgreSQL is running: `pg_isrunning`
- Check DATABASE_URL in .env
- Try: `createdb leetcoach_ai`

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution**:
- Ensure Redis is running: `redis-cli ping` (should return PONG)
- Check REDIS_URL in .env
- Restart Redis: `redis-cli shutdown` then `redis-server`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**:
- Kill process on port: `lsof -ti:5000 | xargs kill` (macOS/Linux)
- Or change PORT in .env to 5001, 5002, etc.

### npm install Fails
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Prisma Migration Issues
```bash
# Reset database (development only!)
npx prisma migrate reset
# Then push migrations again
npm run db:push
```

### CORS Error in Frontend
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**:
- Verify CORS_ORIGIN in backend/.env matches frontend URL
- Default: `CORS_ORIGIN="http://localhost:5173"`
- Restart backend after changing

### OAuth Login Not Working
- Verify callback URLs match exactly in OAuth settings
- Check Client ID/Secret in .env
- Ensure frontend and backend are on correct URLs
- Check browser console for detailed errors

### Database Already Exists
If you need to start fresh:
```bash
# Drop and recreate database
dropdb leetcoach_ai
createdb leetcoach_ai
npm run db:push
```

## Development Tools

### Useful Commands

**Backend**:
```bash
npm run db:generate      # Regenerate Prisma client
npm run db:migrate       # Create new migration
npm run db:studio        # Open Prisma Studio UI
npm run db:seed          # Seed database with sample data
npm run dev              # Start development server
```

**Frontend**:
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Useful Tools

- **Prisma Studio**: Visual database browser (run `npm run db:studio` from backend)
- **Swagger UI**: API documentation at http://localhost:5000/api-docs
- **Redux DevTools**: Install browser extension for Zustand state debugging

## Next Steps

1. Read [README.md](./README.md) for feature overview
2. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
3. See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
4. Start with a simple feature or bug fix

## Getting Help

- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for common issues
- Review error logs in `backend/logs/`
- Check browser console for frontend errors
- Open an issue on GitHub with details

---

**Setup complete!** 🎉

You should now have a fully functioning LeetcodeAI development environment. Start the backend and frontend servers and visit http://localhost:5173 to begin!
