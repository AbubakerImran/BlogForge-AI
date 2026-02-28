# Contributing to BlogForge AI

Thank you for your interest in contributing to BlogForge AI! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

Please be respectful and considerate in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

1. **Fork the repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BlogForge-AI.git
   cd BlogForge-AI
   ```

3. **Set up the development environment**
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Make your changes**
   - Write clean, readable code
   - Follow existing code style and patterns
   - Add comments for complex logic

2. **Test your changes**
   ```bash
   npm run dev  # Start dev server
   npm run lint # Check for linting errors
   npm run build # Test production build
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template

## Pull Request Process

1. **Before submitting:**
   - ✅ Run `npm run lint` and fix any errors
   - ✅ Test your changes locally
   - ✅ Update documentation if needed
   - ✅ Add or update tests if applicable

2. **PR Title Format:**
   - Use conventional commits format: `type: description`
   - Examples:
     - `feat: add dark mode to blog posts`
     - `fix: resolve newsletter subscription bug`
     - `docs: update installation instructions`
     - `chore: update dependencies`

3. **PR Description:**
   - Describe what changes you made
   - Explain why these changes are needed
   - Include screenshots for UI changes
   - Reference any related issues

4. **Review Process:**
   - A maintainer will review your PR
   - Address any requested changes
   - Once approved, your PR will be merged

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` when possible
- Use type inference where appropriate

### React Components

- Use functional components with hooks
- Follow the existing component structure
- Keep components small and focused
- Use proper prop types

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design (mobile-first)
- Test dark mode compatibility

### File Organization

```
src/
├── app/          # Pages and API routes
├── components/   # Reusable React components
├── lib/          # Utilities and configuration
├── hooks/        # Custom React hooks
└── types/        # TypeScript type definitions
```

### Naming Conventions

- **Components:** PascalCase (e.g., `BlogCard.tsx`)
- **Files:** kebab-case (e.g., `use-auth.ts`)
- **Variables:** camelCase (e.g., `userName`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_URL`)

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body

footer
```

### Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semicolons, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Examples

```bash
feat(blog): add reading time calculation
fix(auth): resolve Google OAuth redirect issue
docs(readme): update installation instructions
style(dashboard): improve card spacing
refactor(api): simplify post creation logic
perf(images): optimize image loading
test(auth): add login flow tests
chore(deps): update Next.js to 14.2.35
```

## Testing

### Manual Testing

1. **Test your feature**
   - Create test accounts
   - Try different user scenarios
   - Test on mobile and desktop
   - Test in light and dark mode

2. **Check for errors**
   - Look for console errors
   - Check network requests
   - Verify database updates

3. **Test edge cases**
   - Empty states
   - Long content
   - Invalid inputs
   - Error handling

### Running Builds

```bash
npm run build  # Should complete without errors
npm run start  # Test production build locally
```

## Documentation

### Updating README

When adding new features:
- Update feature list
- Add setup instructions if needed
- Update environment variables section
- Add examples or screenshots

### Code Comments

- Document complex logic
- Explain non-obvious decisions
- Add JSDoc comments for functions
- Keep comments up-to-date

### API Documentation

When adding API routes:
- Document request/response format
- List required parameters
- Provide usage examples
- Note authentication requirements

## Questions?

If you have questions about contributing:
- Open an [Issue](https://github.com/AbubakerImran/BlogForge-AI/issues)
- Check existing documentation
- Review closed PRs for examples

## Thank You!

Your contributions help make BlogForge AI better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
