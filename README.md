# SouthEastSocial

Community event listings for SE London. Built with Payload CMS, Next.js App Router, Neon PostgreSQL, Resend email, and Vercel Blob storage.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| CMS | Payload CMS 3.x |
| Database | PostgreSQL via Neon |
| Email | Resend + React Email |
| Storage | Vercel Blob |
| Styling | Tailwind CSS |
| Deployment | Vercel |

## Local setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Resend](https://resend.com) account with a verified sending domain

### 1. Clone and install

```bash
git clone https://github.com/mike-keefe/SouthEastSocial-app.git
cd SouthEastSocial-app
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in the values (see [Environment variables](#environment-variables) below).

### 3. Run database migrations

```bash
pnpm migrate
```

### 4. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin](http://localhost:3000/admin) for the Payload admin panel.

### 5. Seed sample data (optional)

```bash
pnpm seed
```

This creates 2 categories, 3 venues, 2 organisers, 5 published events, 1 admin, and 1 member user. Credentials are logged to the console.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `PAYLOAD_SECRET` | ✅ | Random secret for Payload auth token signing. Generate with `openssl rand -base64 32` |
| `RESEND_API_KEY` | ✅ | Resend API key |
| `RESEND_FROM_EMAIL` | ✅ | Verified sending address (e.g. `hello@yourdomain.com`) |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | Public URL of the deployed app, no trailing slash (e.g. `https://southeastsocial.com`) |
| `BLOB_READ_WRITE_TOKEN` | ✅ in prod | Vercel Blob token — image uploads fall back to local storage without it |
| `DIGEST_SECRET` | ✅ | Bearer token for the `/api/send-digest` cron endpoint. Generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Optional | Email address to receive admin notifications when events are submitted |

---

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm migrate` | Run pending database migrations |
| `pnpm migrate:create` | Generate a new migration from schema changes |
| `pnpm seed` | Seed the database with sample data |
| `pnpm test:int` | Run unit/integration tests (Vitest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm generate:types` | Regenerate Payload TypeScript types |

---

## Project structure

```
src/
├── app/
│   ├── (frontend)/        # Public-facing Next.js pages
│   ├── (payload)/         # Payload admin panel
│   └── api/               # API routes (send-digest, etc.)
├── collections/           # Payload collection configs
├── components/            # Shared React components
├── lib/
│   ├── access.ts          # Payload access control helpers
│   ├── email/             # Resend client + React Email templates
│   └── env.ts             # Zod-validated environment variables
└── styles/
    └── tokens.ts          # Design system tokens
tests/
├── int/                   # Vitest unit/integration tests
└── e2e/                   # Playwright end-to-end tests
```

---

## Deployment (Vercel)

1. Connect the GitHub repo to a new Vercel project
2. Set all required environment variables in the Vercel dashboard
3. Add the Vercel Blob storage integration
4. Deploy — Vercel auto-detects Next.js and builds accordingly

The weekly digest cron is configured in `vercel.json` (Thursdays at 10am UTC). Vercel calls `/api/send-digest` with the `DIGEST_SECRET` as a bearer token.

---

## Collections

| Collection | Public access | Auth required |
|---|---|---|
| Events | Read published only | Create (submits as pending) |
| Venues | Read published only | — |
| Organisers | Read published only | — |
| Categories | Read all | — |
| Users | Own profile only | — |
| Follows | Own follows only | ✅ |
| EmailSubscriptions | Own record only | ✅ |

Admins can create, update, and delete everything via the admin panel.

---

## Email flows

| Trigger | Email sent | Recipient |
|---|---|---|
| User registers | WelcomeEmail | New user |
| Event submitted | EventSubmittedEmail | Submitter |
| Event submitted | EventAdminNotificationEmail | `ADMIN_EMAIL` (if set) |
| Event published | EventApprovedEmail | Submitter |
| Every Thursday 10am | WeeklyDigestEmail | All opted-in users |
