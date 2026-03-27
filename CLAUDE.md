@AGENTS.md

# SmartExpense — AI Assistant Guide

## Overview

SmartExpense (branded "SmartXpense") is a personal finance tracker built with Next.js 16, React 19, Supabase, and Tailwind CSS v4. Users can log expenses, manage categories, view analytics, and personalize their experience.

---

## Critical: Next.js 16 Breaking Changes

**This project uses Next.js 16.2.1**, which has breaking changes from what AI models typically know. Before writing any Next.js code:

1. Check `node_modules/next/dist/docs/` if it exists
2. Note that the **middleware file is `src/proxy.ts`** (not `middleware.ts`), and the exported function is named `proxy` (not `middleware`) — this is a Next.js 16 convention change
3. Heed any deprecation notices in the codebase

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI | React 19, Tailwind CSS v4 |
| Backend/DB | Supabase (Postgres + Auth + RLS) |
| Data fetching | TanStack React Query v5 |
| Forms | React Hook Form v7 + Zod v4 |
| Charts | Recharts v3 |
| Icons | Lucide React |
| Date utils | date-fns v4 |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (QueryProvider, ToastProvider)
│   ├── page.tsx                  # Root redirect (→ /login or /dashboard)
│   ├── globals.css               # Tailwind v4 + accent theme CSS vars
│   ├── (auth)/                   # Auth layout group (unauthenticated)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/              # Protected layout group
│   │   ├── layout.tsx            # Shell: Sidebar, TopBar, MobileNav
│   │   ├── dashboard/page.tsx    # Stats, charts, recent transactions
│   │   ├── expenses/page.tsx     # Expense CRUD list
│   │   ├── analytics/page.tsx    # Spending breakdown charts
│   │   └── settings/page.tsx     # Profile, preferences, appearance, security
│   ├── auth/callback/route.ts    # OAuth/magic-link callback handler
│   └── privacy/page.tsx          # Public privacy policy
├── proxy.ts                      # Next.js 16 middleware (auth session + redirects)
├── components/
│   ├── ui/                       # Button, Input, Select, Card, Badge, Modal, WordmarkLogo
│   ├── auth/                     # AuthLayout, LoginForm, SignupForm
│   ├── charts/                   # CategoryDonutChart, MonthlyBarChart, SpendingTrendLine
│   ├── dashboard/                # RecentTransactions
│   ├── expenses/                 # ExpenseForm, ExpenseList, ExpenseItem, DeleteConfirm
│   ├── layout/                   # Sidebar, TopBar, MobileNav
│   ├── providers/                # QueryProvider, ThemeProvider, ToastProvider
│   └── settings/                 # ProfileSection, PreferencesSection, AppearanceSection,
│                                 # SecuritySection, SettingsNav
├── hooks/
│   ├── useExpenses.ts            # useExpenses, useAddExpense, useUpdateExpense, useDeleteExpense
│   ├── useCategories.ts          # useCategories, useAddCategory, useDeleteCategory (+ seed)
│   ├── useProfile.ts             # useProfile, useUser
│   └── useProfileUpdate.ts       # useProfileUpdate, useChangePassword, useUpdateTheme
├── lib/
│   ├── utils.ts                  # cn(), formatCurrency(), formatDate()
│   └── supabase/
│       ├── client.ts             # Browser Supabase client
│       ├── server.ts             # Server-side Supabase client (cookie-based)
│       └── middleware.ts         # updateSession() — session refresh + auth redirects
└── types/
    └── index.ts                  # Profile, Category, Expense, ExpenseFormData, ThemeColor
```

---

## Authentication & Middleware

- **Auth provider**: Supabase Auth (email/password; OAuth removed)
- **Middleware file**: `src/proxy.ts` — exports `proxy` function (Next.js 16 naming)
- **Session logic**: `src/lib/supabase/middleware.ts` `updateSession()` runs on every request
- **Route protection**:
  - Unauthenticated → redirected to `/login` (except `/auth/*`, `/privacy`, `/`)
  - Authenticated visiting `/login` or `/signup` → redirected to `/dashboard`
- **Server client**: Use `createClient()` from `@/lib/supabase/server` in Server Components/Route Handlers
- **Browser client**: Use `createClient()` from `@/lib/supabase/client` in Client Components

---

## Database Schema

Managed via `supabase/migrations/001_initial_schema.sql`. All tables have Row Level Security (RLS) enabled — users can only access their own data.

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | FK → auth.users (PK) |
| full_name | text | nullable |
| avatar_url | text | nullable |
| currency | text | default 'USD' |
| created_at | timestamptz | |

> **Note**: The TypeScript `Profile` type (`src/types/index.ts`) includes `username`, `theme_color`, and `monthly_budget` fields that are **not yet in the migration**. These columns must be added via a new migration before use.

### `categories`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| name | text | |
| icon | text | emoji, default '💰' |
| color | text | hex, default '#6366f1' |
| is_default | boolean | default false |
| created_at | timestamptz | |

Default categories (Food & Dining, Transport, Housing, Entertainment, Health, Shopping, Other) are **seeded by the app** via `useCategories` hook on first login — not in SQL.

### `expenses`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| category_id | uuid | FK → categories (nullable, set null on delete) |
| amount | numeric(12,2) | check > 0 |
| currency | text | default 'USD' |
| date | date | |
| note | text | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | auto-updated by trigger |

---

## Data Fetching Conventions

All data fetching uses **TanStack React Query v5** with hooks in `src/hooks/`.

- All hooks are `'use client'` (browser-only, use Supabase browser client)
- Query keys follow `['resource', userId]` pattern
- All queries are gated with `enabled: !!userId`
- Mutations call `queryClient.invalidateQueries()` on success
- Default `staleTime`: 60 seconds; `retry`: 1

```typescript
// Pattern for queries
useQuery({
  queryKey: ['expenses', userId],
  queryFn: async () => { /* supabase query */ },
  enabled: !!userId,
})

// Pattern for mutations
useMutation({
  mutationFn: async ({ userId, data }) => { /* supabase mutation */ },
  onSuccess: (_data, variables) => {
    queryClient.invalidateQueries({ queryKey: ['expenses', variables.userId] })
  },
})
```

---

## Styling Conventions

### Tailwind CSS v4
- Import syntax: `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- Custom utilities use `@utility` directive (not `@layer utilities`)
- Path alias: `@/*` → `./src/*`

### Accent Theme System
Five theme colors defined via CSS custom properties in `globals.css`:
- `indigo` (default), `violet`, `rose`, `amber`, `emerald`
- Set via `data-theme` attribute on `<html>` by `ThemeProvider`
- Use semantic classes: `bg-accent`, `bg-accent-dark`, `bg-accent-light`, `text-accent`, `text-accent-dark`, `border-accent`, `ring-accent`
- Never hardcode indigo/violet/etc. colors for UI accents — use `*-accent` classes

### Utility Functions (`src/lib/utils.ts`)
```typescript
cn(...inputs)          // clsx + tailwind-merge
formatCurrency(amount, currency?)  // Intl.NumberFormat
formatDate(date)       // date string → formatted display
```

---

## Component Conventions

- All interactive/stateful components: add `'use client'` at top
- Server Components are the default (no directive needed)
- Layout groups use parentheses: `(auth)`, `(dashboard)`
- UI primitives live in `src/components/ui/` — reuse before creating new ones
- Form validation uses Zod schemas with `@hookform/resolvers/zod`

---

## TypeScript

- Strict mode enabled (`"strict": true` in tsconfig)
- Import types explicitly: `import type { X } from '@/types'`
- Path alias `@/` maps to `src/`
- No `any` — prefer `unknown` with type narrowing

---

## Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

No test runner is configured. There are no test files in this project.

---

## Environment Variables

Required (not committed):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Known Issues / Schema Drift

1. **Profile columns missing**: `username`, `theme_color`, `monthly_budget` are in `src/types/index.ts` but absent from `supabase/migrations/001_initial_schema.sql`. A follow-up migration is needed.
2. **No test infrastructure**: No Jest, Vitest, or Cypress configured.
3. **No CI/CD**: No `.github/workflows` directory.

---

## Development Workflow

1. New database columns → add a new numbered migration file in `supabase/migrations/`
2. New data entities → add types to `src/types/index.ts`, hooks in `src/hooks/`
3. New pages → create under `src/app/(dashboard)/` for protected routes
4. New UI primitives → add to `src/components/ui/` before adding feature-specific components
5. Always use `cn()` for conditional className logic
6. Keep server/client boundary explicit — Supabase server client for RSC, browser client for hooks
