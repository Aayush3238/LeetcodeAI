# 🤝 Contributing Guide - LeetcodeAI

Thank you for your interest in contributing to LeetcodeAI! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on code and ideas, not individuals
- Help others learn and grow

## Getting Started

### 1. Fork & Clone
```bash
git clone <your-fork-url>
cd LeetcodeAI
git remote add upstream <original-repo-url>
```

### 2. Create Development Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

### 3. Set Up Development Environment
```bash
# Follow SETUP.md instructions
npm install  # in both backend/ and frontend/
```

### 4. Create a Feature Branch
```bash
git checkout -b feature/descriptive-name
```

## Development Workflow

### Backend Development

**Start Development Server**:
```bash
cd backend
npm run dev
```

**Project Structure**:
```
backend/src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/          # API route definitions
├── services/        # Business logic
├── utils/           # Utility functions
└── validators/      # Input validation schemas
```

**Key Technologies**:
- Express.js - Web framework
- Prisma - ORM & migrations
- Zod - Schema validation
- Winston - Logging
- OpenAI API - AI features

**Coding Standards**:
- Use camelCase for variables/functions
- Use PascalCase for classes/models
- Add JSDoc comments for functions
- Keep functions focused (single responsibility)
- Write descriptive error messages
- Use async/await over callbacks

**Example Controller**:
```javascript
/**
 * Get user dashboard statistics
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express error handler
 */
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Fetch data in parallel
    const [problems, submissions] = await Promise.all([
      prisma.userProblem.findMany({ where: { userId } }),
      prisma.submission.findMany({ where: { userId } })
    ]);
    
    // Transform and return data
    res.json({
      stats: {
        totalSolved: problems.length,
        totalSubmissions: submissions.length
      }
    });
  } catch (error) {
    next(error);
  }
};
```

### Frontend Development

**Start Development Server**:
```bash
cd frontend
npm run dev
```

**Project Structure**:
```
frontend/src/
├── components/      # Reusable React components
├── pages/           # Route-level components
├── services/        # API client code
├── stores/          # Zustand state management
├── hooks/           # Custom React hooks
├── constants/       # App constants
└── utils/           # Utility functions
```

**Key Technologies**:
- React 18 - UI library
- Vite - Build tool
- TailwindCSS - Styling
- React Query - Data fetching
- Zustand - State management
- React Router v6 - Routing

**Coding Standards**:
- Use functional components with hooks
- Use camelCase for variables/functions
- Use PascalCase for component names
- Keep components focused and reusable
- Add PropTypes or TypeScript types
- Write meaningful JSDoc comments

**Example Component**:
```jsx
import { useQuery } from '@tanstack/react-query'
import { dashboardAPI } from '../services/api'
import { motion } from 'framer-motion'

/**
 * Dashboard component showing user statistics
 */
export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getDashboard()
  })

  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorCard error={error} />

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {/* Component content */}
    </motion.div>
  )
}
```

## Making Changes

### Backend Changes

**1. Update Database Schema (if needed)**:
```bash
# Edit backend/prisma/schema.prisma

# Create migration
npm run db:migrate

# Or push changes directly to development DB
npm run db:push
```

**2. Create/Update Controllers**:
```bash
backend/src/controllers/yourController.js
```

**3. Create/Update Routes**:
```bash
backend/src/routes/yourRoutes.js
```

**4. Add Validation Schema**:
```bash
backend/src/validators/yourValidator.js
```

### Frontend Changes

**1. Create Component**:
```bash
frontend/src/components/YourComponent.jsx
```

**2. Add to Store (if needed)**:
```bash
frontend/src/stores/yourStore.js
```

**3. Use in Pages**:
```bash
frontend/src/pages/YourPage.jsx
```

## Testing

### Run Tests (when available)
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Manual Testing
1. Test the feature in browser
2. Check browser console for errors
3. Test with different screen sizes
4. Test error cases and edge cases
5. Check API response in network tab

## Committing Code

### Commit Message Format
```
[type]: Brief description

Longer description explaining the change,
why it was made, and any related issues.

Fixes #123
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no logic changes)
- `refactor`: Code restructuring
- `test`: Test additions/updates
- `chore`: Build, deps, etc.

**Examples**:
```
feat: Add AI code analysis feature

Implements OpenAI integration to analyze user submissions
with complexity analysis and optimization suggestions.

Fixes #42
```

```
fix: Resolve CSRF token validation error

CSRF token was not being properly validated on state-changing
operations. Updated middleware to correctly set and verify token.

Fixes #87
```

### Git Workflow
```bash
# Make sure you're on your feature branch
git status

# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: Add awesome feature"

# Push to your fork
git push origin feature/awesome-feature
```

## Submitting Pull Requests

### Before Submitting
- [ ] Code follows project style guide
- [ ] All features work as intended
- [ ] No console errors or warnings
- [ ] Updated relevant documentation
- [ ] Tested on multiple browsers (frontend)
- [ ] Database migrations work properly (backend)

### PR Description Template
```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How to test the changes

## Screenshots
For UI changes, add screenshots

## Checklist
- [ ] Code follows style guide
- [ ] No console errors
- [ ] Tests passing
- [ ] Documentation updated
```

### PR Review Process
1. Maintainers will review your code
2. Address any feedback or requested changes
3. Once approved, your PR will be merged

## Documentation

### README Requirements
- Clear project description
- Quick start instructions
- Feature overview
- Tech stack
- Contributing guidelines

### Code Comments
- Explain WHY, not WHAT
- Use JSDoc for functions
- Keep comments up-to-date
- Document complex algorithms

**Good Comment**:
```javascript
// Use hash map for O(1) lookup instead of nested loop for O(n²)
const map = new Map()
for (const num of nums) {
  map.set(num, index)
}
```

**Bad Comment**:
```javascript
// Loop through array
for (const num of nums) {
  // ...
}
```

## Issue Reporting

### When Reporting Issues
1. **Search First** - Check if issue already exists
2. **Use Template** - Fill out issue template completely
3. **Provide Context**:
   - OS and browser (for frontend)
   - Node version (for backend)
   - Steps to reproduce
   - Expected vs actual behavior
4. **Include Logs** - Add error messages and stack traces

### Issue Template
```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari
- Node version: 18.x
```

## Project Structure Conventions

### Adding a New Feature

**Backend**:
```
1. Add database model in prisma/schema.prisma
2. Create migration: npm run db:migrate
3. Create controller: src/controllers/featureController.js
4. Create routes: src/routes/feature.js
5. Create validator: src/validators/feature.js
6. Add to main router in index.js
```

**Frontend**:
```
1. Create component: src/components/Feature.jsx
2. Create page (if needed): src/pages/FeaturePage.jsx
3. Add route in App.jsx
4. Create API service: src/services/featureAPI.js
5. Add state to store if needed
```

## Performance Considerations

### Backend
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache frequently accessed data (Redis)
- Use connection pooling
- Avoid N+1 queries with proper Prisma eager loading

### Frontend
- Use React.lazy for code splitting
- Implement pagination/infinite scroll
- Memoize expensive computations
- Use React Query for efficient caching
- Optimize images
- Minimize bundle size

## Security Best Practices

### Backend
- Validate all inputs with Zod schemas
- Use parameterized queries (Prisma handles this)
- Implement CSRF protection
- Use HTTPS in production
- Sanitize error messages
- Implement rate limiting
- Hash passwords with bcrypt

### Frontend
- Sanitize user-generated content
- Use HTTPS
- Implement CSRF tokens
- Validate input client-side
- Store sensitive data securely
- Keep dependencies updated

## Resources

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://zustand-demo.vercel.app/)

## Getting Help

- **Discord/Slack**: Join community chat (if available)
- **GitHub Discussions**: Ask questions
- **Issues**: Report bugs
- **Documentation**: Check docs folder
- **Maintainers**: Reach out for guidance

## Contribution Levels

### Level 1: Getting Started
- Documentation fixes
- UI/UX improvements (minor)
- Bug fixes (simple)
- Test additions

### Level 2: Experienced
- New features
- Performance optimization
- Refactoring
- Database changes

### Level 3: Expert
- Architecture decisions
- Security implementation
- Major feature planning
- Release management

## Rewards & Recognition

Contributors will be recognized in:
- README contributors section
- GitHub contributors graph
- Release notes for major contributions

## Code Review Checklist

When reviewing code, check for:
- [ ] Code follows project style
- [ ] Logic is correct
- [ ] No security issues
- [ ] Handles errors properly
- [ ] Performance is acceptable
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No console errors
- [ ] Solves the issue/feature
- [ ] No unnecessary complexity

## Development Tips

### Debugging
**Backend**:
```bash
# Add debug logging
console.log('DEBUG:', variable)

# Use Prisma Studio
npm run db:studio

# Check logs
tail -f logs/combined.log
```

**Frontend**:
```javascript
// Use React DevTools extension
// Use Network tab to monitor API calls
// Use Console for errors
console.log('DEBUG:', variable)
```

### Common Issues & Solutions

**Issue**: Port already in use
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

**Issue**: Database connection error
```bash
# Verify PostgreSQL is running
psql -U postgres
```

**Issue**: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Release Process

- Maintainers manage releases
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog updated before release
- Tags created for each release

## Final Notes

- Start small with bug fixes or documentation
- Ask questions if unclear
- Be patient with review process
- Thank you for contributing!

---

**Happy Contributing! 🚀**

Questions? Open an issue or reach out to maintainers.
