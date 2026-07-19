import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

/**
 * RakshAI database schema (Drizzle ORM / SQLite for local dev).
 *
 * NOTE ON PRODUCTION (Vercel): Vercel's serverless functions have a
 * read-only, ephemeral filesystem, so a SQLite file cannot persist data
 * between requests in production. For a real deployment, point
 * DATABASE_URL at a hosted Postgres instance (Neon/Supabase/Vercel
 * Postgres all have free tiers) and swap the driver in lib/db/client.ts
 * from `better-sqlite3` to `postgres` (see comments there). The table
 * shapes below map 1:1 to Postgres with only trivial type changes.
 */

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["citizen", "police", "bank"] })
    .notNull()
    .default("citizen"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const scans = sqliteTable("scans", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inputType: text("input_type", {
    enum: ["text", "url", "ocr_image", "ocr_pdf"],
  })
    .notNull()
    .default("text"),
  inputText: text("input_text").notNull(),
  extractedText: text("extracted_text"),
  verdict: text("verdict", { enum: ["scam", "safe"] }).notNull(),
  confidence: real("confidence").notNull(),
  riskLevel: text("risk_level", {
    enum: ["low", "medium", "high", "critical"],
  }).notNull(),
  category: text("category").notNull(),
  explanation: text("explanation").notNull(),
  action: text("action").notNull(),
  source: text("source").notNull().default("gemini"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const reports = sqliteTable("reports", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  scanId: text("scan_id")
    .notNull()
    .unique()
    .references(() => scans.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const settings = sqliteTable("settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  emailAlerts: integer("email_alerts", { mode: "boolean" })
    .notNull()
    .default(true),
  smsAlerts: integer("sms_alerts", { mode: "boolean" }).notNull().default(false),
  autoSaveReports: integer("auto_save_reports", { mode: "boolean" })
    .notNull()
    .default(true),
  riskSensitivity: text("risk_sensitivity")
    .notNull()
    .default("balanced"),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  scans: many(scans),
  reports: many(reports),
  settings: one(settings, {
    fields: [users.id],
    references: [settings.userId],
  }),
}));

export const scansRelations = relations(scans, ({ one }) => ({
  user: one(users, { fields: [scans.userId], references: [users.id] }),
  report: one(reports, { fields: [scans.id], references: [reports.scanId] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, { fields: [reports.userId], references: [users.id] }),
  scan: one(scans, { fields: [reports.scanId], references: [scans.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type Settings = typeof settings.$inferSelect;
