import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

/**
 * PRODUCTION NOTE (read this before deploying to Vercel):
 * -----------------------------------------------------------------------
 * Vercel serverless functions run on an ephemeral, read-only filesystem
 * (except /tmp, which is wiped between invocations). A SQLite file here
 * works perfectly for local development and demos, but will NOT persist
 * scan history between requests once deployed to Vercel.
 *
 * To make this production-ready, provision a free hosted Postgres
 * database (Neon, Supabase, or Vercel Postgres), then:
 *   1. npm install postgres
 *   2. Change the import below to `drizzle-orm/postgres-js` and pass a
 *      `postgres(process.env.DATABASE_URL)` client instead of Database.
 *   3. Change `sqliteTable` -> `pgTable` (and int/text helpers) in
 *      lib/db/schema.ts — the shapes are almost identical.
 *   4. Run `npx drizzle-kit push` to create the tables.
 * -----------------------------------------------------------------------
 */

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH =
  process.env.DATABASE_URL?.replace(/^file:/, "") ||
  path.join(DATA_DIR, "rakshai.db");

declare global {
  // eslint-disable-next-line no-var
  var __rakshai_sqlite__: Database.Database | undefined;
}

const sqlite = global.__rakshai_sqlite__ ?? new Database(DB_PATH);
if (process.env.NODE_ENV !== "production") {
  global.__rakshai_sqlite__ = sqlite;
}

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Bootstrap the schema on first run so `npm run dev` works with zero
// manual migration steps. Safe to call repeatedly (IF NOT EXISTS).
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'citizen',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    input_type TEXT NOT NULL DEFAULT 'text',
    input_text TEXT NOT NULL,
    extracted_text TEXT,
    verdict TEXT NOT NULL,
    confidence REAL NOT NULL,
    risk_level TEXT NOT NULL,
    category TEXT NOT NULL,
    explanation TEXT NOT NULL,
    action TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'gemini',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );
  CREATE INDEX IF NOT EXISTS idx_scans_user_created ON scans(user_id, created_at);

  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scan_id TEXT NOT NULL UNIQUE REFERENCES scans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );
  CREATE INDEX IF NOT EXISTS idx_reports_user_created ON reports(user_id, created_at);

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_alerts INTEGER NOT NULL DEFAULT 1,
    sms_alerts INTEGER NOT NULL DEFAULT 0,
    auto_save_reports INTEGER NOT NULL DEFAULT 1,
    risk_sensitivity TEXT NOT NULL DEFAULT 'balanced',
    updated_at TEXT NOT NULL DEFAULT (current_timestamp)
  );
`);

export const db = drizzle(sqlite, { schema });
export { schema };
