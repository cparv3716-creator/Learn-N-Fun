# Learn 'N' Fun Abacus

Marketing website and launch-ready enquiry workflow for an abacus training
company, built with Next.js, Tailwind CSS, TypeScript, Prisma, and PostgreSQL.

## Current scope

- Public marketing pages
- Prisma-backed Book Demo submissions
- Prisma-backed Contact submissions
- Protected admin login
- Admin dashboard for viewing and updating enquiry status

## Stack

- Next.js 16 App Router
- Tailwind CSS 4
- TypeScript
- Prisma 7
- PostgreSQL

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to your PostgreSQL connection string.
3. Set the admin credentials:

```bash
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-this-before-production"
ADMIN_SESSION_SECRET="replace-with-a-long-random-secret"
```

4. Optional: use `ADMIN_PASSWORD_HASH` instead of `ADMIN_PASSWORD`.

Supported formats:

- `sha256:<hex-digest>`
- `scrypt:<salt>:<hex-digest>`

## Database setup

Generate the Prisma client and apply the schema:

```bash
npm run db:generate
npm run db:push
```

Other useful commands:

```bash
npm run db:migrate
npm run db:studio
```

## Admin access

- Login page: `/admin/login`
- Dashboard: `/admin`

The admin session uses an HTTP-only, signed cookie and protected server-side
route checks.

## Project structure

```text
app/
  (marketing)/         Public website pages
  actions/             Server actions for enquiries and admin auth
  admin/               Protected admin routes
components/
  admin/               Admin login UI
  forms/               Public enquiry forms
  layout/              Shared header and footer
  marketing/           Reusable page cards and content sections
  ui/                  Container, buttons, headings, page hero
lib/
  prisma.ts            Prisma client singleton
  site-data.ts         Shared marketing content
  utils.ts             Shared helpers
prisma/
  schema.prisma        Database models
server/
  admin-auth.ts        Cookie-based admin session and credential helpers
```
