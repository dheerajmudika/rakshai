# RakshAI — AI-Powered Digital Public Safety Platform

A full-stack Next.js 15 app that detects phishing, fake UPI payment requests,
WhatsApp/SMS/email scams, AI-generated scam text, and digital arrest scams —
from pasted text/URLs or from uploaded screenshots/PDFs via OCR.

## Quick start

```bash
npm install
cp .env.example .env   # then paste your Gemini key (see below)
npm run dev
```

Open http://localhost:3000. No database setup needed — a local SQLite file
is created automatically on first run.

## Where to paste your Gemini API key

Open **`.env`** (create it from `.env.example` if it doesn't exist yet) and
set:

```
GEMINI_API_KEY=your_actual_key_here
```

Get a free key at https://aistudio.google.com/app/apikey. Restart `npm run
dev` after changing it. If the key is missing or invalid, scam detection
automatically falls back to an offline rule-based analyzer (see
[AI detection](#ai-detection) below) instead of failing — so the app still
works for a demo even without a key, just with lower-confidence results.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript, React 19
- **Auth**: Custom JWT sessions (`jose`, edge-compatible) in httpOnly
  cookies, `bcryptjs` password hashing, `middleware.ts` route protection
- **Database**: Drizzle ORM + SQLite (`better-sqlite3`) for local dev,
  designed to swap to hosted Postgres for production (see below)
- **AI**: Google Gemini via the official `@google/genai` SDK, structured
  JSON output, validated with `zod`
- **OCR**: `tesseract.js` for images (with a locally bundled English model —
  no runtime CDN dependency), `pdf-parse-fork` for text-layer PDFs
- **Charts**: `recharts`
- **Styling**: Tailwind CSS, Framer Motion

## AI detection

`lib/ai/gemini.ts` sends the input (plus a set of deterministic heuristic
signals from `lib/ai/heuristics.ts` — URL shorteners, UPI handles, urgency
language, digital-arrest scam markers, etc.) to Gemini with a strict JSON
response schema covering: verdict, confidence, risk level, scam category,
explanation, and recommended action. Nothing is hardcoded — every scan is a
real model call.

If `GEMINI_API_KEY` is unset or the API call fails for any reason, the same
heuristic signals are used to produce a lower-confidence offline verdict
instead of crashing or returning fake data, and the UI clearly labels the
result as "Offline heuristic mode."

## Project structure

```
app/
  api/                  Route handlers (auth, scan, scan/ocr, scans, reports, settings, dashboard/stats)
  dashboard/            Protected app: overview, scan detector, reports, settings
  login/, signup/       Auth pages
lib/
  auth.ts               Node-only: bcrypt + getCurrentUser (DB-backed)
  session.ts            Edge-safe: JWT sign/verify + cookies (used by middleware.ts)
  db/                   Drizzle schema + client
  ai/                   gemini.ts, heuristics.ts, ocr.ts
components/
  dashboard/, scan/, ui/, landing/
middleware.ts           Protects /dashboard/*, redirects logged-in users away from /login,/signup
```

## Deploying to Vercel

**Important — read before deploying:** Vercel's serverless functions run on
an ephemeral, read-only filesystem. The local SQLite file in this repo is
great for development and local demos, but it **will not persist** scan
history between requests once deployed to Vercel (each invocation may get a
fresh filesystem).

To make this production-ready:

1. Provision a free hosted Postgres database — [Neon](https://neon.tech),
   [Supabase](https://supabase.com), or Vercel Postgres all work.
2. `npm install postgres`
3. In `lib/db/schema.ts`, swap `sqlite-core` imports for `pg-core`
   (`sqliteTable` → `pgTable`, `integer(...).mode("boolean")` → `boolean`,
   etc. — the shapes are nearly identical).
4. In `lib/db/client.ts`, replace the `better-sqlite3` + `drizzle-orm/better-sqlite3`
   setup with `postgres(process.env.DATABASE_URL)` +
   `drizzle-orm/postgres-js`.
5. Run `npx drizzle-kit push` to create the tables.
6. In Vercel's project settings, set the environment variables:
   - `DATABASE_URL` → your Postgres connection string
   - `JWT_SECRET` → a long random string (`openssl rand -base64 32`)
   - `GEMINI_API_KEY` → your Gemini API key
7. Deploy. `output: "standalone"` is not required; Vercel handles the
   Next.js build automatically.

Everything else (auth, middleware, the Gemini integration, OCR) works
unchanged on Vercel — only the database driver needs swapping.

