# Student Management System

A full-stack student management and application system for an educational institution with multiple campuses (Springs, Braamfontein, JHB).

## Tech Stack

- **Frontend**: React 18, Vite 7, Tailwind CSS, Shadcn UI, Wouter routing
- **Backend**: Express 5 (Node.js/TypeScript)
- **Database**: PostgreSQL via Replit's built-in database, Drizzle ORM
- **Auth**: Replit Auth (OpenID Connect via passport.js)
- **Validation**: Zod throughout (shared schemas)

## Project Structure

```
client/          # React frontend
  src/
    components/  # UI components (Shadcn/Radix-based)
    hooks/       # Data fetching hooks (TanStack Query)
    pages/       # App views (Dashboard, Applications, Courses, Payments)
    lib/         # Utilities, API client config
server/          # Express backend
  index.ts       # Server entrypoint (port 5000, 0.0.0.0)
  routes.ts      # API route definitions (all protected with isAuthenticated)
  storage.ts     # Data access layer
  db.ts          # Drizzle + pg pool setup
  replit_integrations/auth/  # Replit Auth (OIDC, sessions, passport)
shared/          # Shared between client and server
  schema.ts      # Drizzle table schemas + Zod types
  models/auth.ts # Auth tables (users, sessions)
  routes.ts      # API route contracts
```

## Key Features

- Role-based access: Admin, Clerk, Faculty, Student
- Course management (CRUD) across faculties and campuses
- Student application workflow (apply, approve/reject)
- Payment recording and invoice management
- Dashboard analytics (students, applications, revenue)

## Running

- Development: `npm run dev` (tsx server/index.ts, Vite dev server via middleware)
- Database push: `npm run db:push`

## Security Notes

- All API routes require authentication via `isAuthenticated` middleware
- Sessions stored in PostgreSQL (connect-pg-simple), TTL = 7 days
- Session cookies: httpOnly, secure, sameSite=lax
- Input validation via Zod on all POST/PUT/PATCH endpoints
- Drizzle ORM uses parameterized queries (SQL injection safe)

## Environment Variables

Required secrets (managed by Replit):
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Session signing secret
- `REPL_ID` — Replit app ID (auto-set)
- `REPLIT_DOMAINS` — Allowed domains (auto-set)
