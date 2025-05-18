# Yelm Country Carvings - Developer Guidelines

## Project Overview
Yelm Country Carvings is a monorepo project consisting of:
- **Frontend**: React-based website with public and admin sections
- **Backend**: Bun-powered API server with PostgreSQL database

## Tech Stack
- **Package Manager**: Bun
- **Frontend**: 
  - React 19
  - TypeScript
  - Vite
  - TailwindCSS
  - React Router
  - React Hook Form + Zod
- **Backend**:
  - Bun
  - TypeScript
  - PostgreSQL
  - JWT for authentication
  - Sharp for image processing
- **Infrastructure**:
  - Docker for development and testing
  - Docker Compose for service orchestration

## Project Structure
```
yelm-country-carvings/
├── packages/
│   ├── frontend/         # React application (public site + admin portal)
│   └── backend/          # API server
├── .env                  # Environment variables
└── docker-compose.yml    # Docker configuration
```

## Development Workflow

### Running the Application
- Start backend: `bun run dev`
- Start frontend: `bun run --cwd packages/frontend dev`
- Access:
  - Main website: http://localhost:5173
  - Admin portal: http://localhost:5173/admin

### Testing
- Run all tests: `bun run test`
- Run tests with watch mode: `bun run --cwd packages/backend test:watch`
- Run tests with coverage: `bun run --cwd packages/backend test:coverage`

### Building for Production
- Build all packages: `bun run build`
- Build specific package: `bun run --cwd packages/<package-name> build`

## Best Practices

### Code Style
- Follow ESLint rules: `bun run lint`
- Use TypeScript for type safety
- Follow React hooks best practices
- Prefer semi-generalized and reusable functions and components
- Keep the code organized
- "A Philosophy of Software Design" book by John Ousterhout

### Security
- Never commit `.env` files
- Use strong passwords and JWT secrets
- Validate all user inputs