# Blog Platform

A fullstack blog platform with role-based access control (Visitor / User / Admin), built as a learning project covering the full Next.js App Router stack end to end.

## Stack

| Layer     | Choice                                                                                                                              |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router), TypeScript                                                                                                 |
| Styling   | Tailwind CSS v4                                                                                                                     |
| Database  | PostgreSQL                                                                                                                          |
| ORM       | Prisma, `@prisma/adapter-pg` driver adapter                                                                                         |
| Auth      | Auth.js (`next-auth@beta`, v5) — GitHub + Google OAuth, plus hand-rolled email/password sharing the same database session mechanism |
| Icons     | `lucide-react` + inline SVG for brand marks (GitHub/Google) not covered by Lucide                                                   |

No separate backend — Next.js Route Handlers and Server Actions serve as the API layer.

## Features

- Public: browse posts, view individual posts, view author profiles
- Authenticated users: create/edit/delete their own posts, update profile (name, username)
- Admins: edit/delete any post, promote/demote user roles
- Auth: GitHub OAuth, Google OAuth, and email/password registration/login, all producing an identical database-backed session
- Route protection via `proxy.ts` (Next.js 16's renamed middleware) plus per-page ownership/role checks (defense in depth)

## Getting started

### Prerequisites

- Node.js 18+
- A running PostgreSQL instance (local or hosted)

### Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in the values (see below).

```bash
npx prisma migrate deploy
npx prisma generate
```

```bash
npm run dev
```

Visit `http://localhost:3000`.

### Environment variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Auth.js
AUTH_SECRET=""              # generate with: npx auth secret

# GitHub OAuth (https://github.com/settings/developers)
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# Google OAuth (https://console.cloud.google.com/apis/credentials)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

OAuth callback URLs to register with each provider:

- GitHub: `{APP_URL}/api/auth/callback/github`
- Google: `{APP_URL}/api/auth/callback/google` (also add `{APP_URL}` under Authorized JavaScript origins, no path)

## Project structure

```
src/
  app/
    (public routes)
      page.tsx                       # home
      posts/page.tsx                 # all posts
      posts/[slug]/page.tsx          # post detail
      posts/new/page.tsx             # create post (client component)
      author/[username]/page.tsx     # author profile
      login/page.tsx                 # credentials + OAuth sign-in
      register/page.tsx
      forgot-password/page.tsx       # placeholder, reset flow not yet built

    dashboard/                       # auth-gated section
      layout.tsx                     # sidebar, session check
      posts/page.tsx                 # "my posts" — edit/delete own
      posts/[slug]/edit/page.tsx
      settings/page.tsx              # update name/username
      admin/
        users/page.tsx               # admin: promote/demote roles
        posts/page.tsx               # admin: edit/delete any post

    api/
      posts/route.ts                 # GET (public), POST (auth required)
      posts/[slug]/route.ts          # GET (public), PUT/DELETE (owner or admin)
      auth/[...nextauth]/route.ts    # Auth.js handlers

  components/
    Navbar.tsx
    PostCard.tsx

  lib/
    prisma.ts                        # Prisma client singleton
    session.ts                       # manual DB session creation for credentials login

  auth.ts                            # Auth.js config
  proxy.ts                           # route protection (Next.js 16 middleware)
  types/next-auth.d.ts               # module augmentation for Session/AdapterUser

prisma/
  schema.prisma
  migrations/
```

## Architecture notes

**Why no separate Express backend.** Next.js Route Handlers cover the API surface; a second server would mean two runtimes, two deploy targets, and no real benefit at this scale.

**Why Prisma over raw SQL.** Type-safe queries, autocomplete, and migrations that are readable and reversible.

**Auth: OAuth via Auth.js, credentials hand-rolled.** Auth.js manages GitHub/Google end to end (state validation, token exchange, ID token verification — all correctness-critical and easy to get subtly wrong by hand). Email/password is implemented manually rather than via Auth.js's Credentials provider, because Auth.js requires JWT sessions when Credentials is used, and this project deliberately keeps database sessions (instant revocation, inspectable in Prisma Studio). `src/lib/session.ts` creates a session row via the same Prisma adapter and sets Auth.js's session cookie directly.

**Caveat on the manual session approach:** the session cookie name/format is Auth.js's internal implementation detail, not a published API contract. An `next-auth` version upgrade could change it and silently break credentials login. If that happens, check `src/lib/session.ts` first.

**Route protection is layered, not single-point.** `proxy.ts` is the primary gate for everything under `/dashboard/*`, redirecting before any page code runs. Individual admin pages and mutation-owning API routes re-check session/role independently — a bug in one layer doesn't remove the other.

**Server Components by default, Client Components only where needed.** A component only gets `"use client"` if it needs to react to input before submission (e.g. the new-post form's live slug generation). Everything else — including most forms — stays a Server Component with an inline or file-level Server Action, which ships less JavaScript to the browser.

## Known gaps / not yet built

- Password reset flow (UI placeholder exists at `/forgot-password`; token generation and email delivery via Resend not implemented)
- Comments
- No rate limiting on auth endpoints (login/register are currently unthrottled)
- No email verification for credentials-based signups
- Admin cannot currently see unpublished/draft posts from other users outside their own dashboard (all-posts admin view does include drafts; verify before relying on this for moderation)

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build
npx prisma studio       # visual database browser
npx prisma migrate dev  # create + apply a migration in development
```
