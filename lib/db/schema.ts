import { pgTable, text, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/**
 * RakshAI database schema (Drizzle ORM / PostgreSQL for production).
 */

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role")
    .$type<"citizen" | "police" | "bank">()
    .notNull()
    .default("citizen"),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export const scans = pgTable("scans", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inputType: text("input_type")
    .$type<"text" | "url" | "ocr_image" | "ocr_pdf">()
    .notNull()
    .default("text"),
  inputText: text("input_text").notNull(),
  extractedText: text("extracted_text"),
  verdict: text("verdict")
    .$type<"scam" | "safe">()
    .notNull(),
  confidence: real("confidence").notNull(),
  riskLevel: text("risk_level")
    .$type<"low" | "medium" | "high" | "critical">()
    .notNull(),
  category: text("category").notNull(),
  explanation: text("explanation").notNull(),
  action: text("action").notNull(),
  source: text("source").notNull().default("gemini"),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export const reports = pgTable("reports", {
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
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export const settings = pgTable("settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  emailAlerts: boolean("email_alerts")
    .notNull()
    .default(true),
  smsAlerts: boolean("sms_alerts")
    .notNull()
    .default(false),
  autoSaveReports: boolean("auto_save_reports")
    .notNull()
    .default(true),
  riskSensitivity: text("risk_sensitivity")
    .notNull()
    .default("balanced"),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
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
