import { NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { jsonError, jsonOk, requireUser, isError } from "@/lib/api-utils";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function GET() {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;

  const rows = await db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.userId, user.id))
    .limit(1);

  let userSettings = rows[0];
  if (!userSettings) {
    const [created] = await db
      .insert(schema.settings)
      .values({ userId: user.id })
      .returning();
    userSettings = created;
  }

  return jsonOk({
    settings: userSettings,
    profile: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

const UpdateSettingsSchema = z.object({
  emailAlerts: z.boolean().optional(),
  smsAlerts: z.boolean().optional(),
  autoSaveReports: z.boolean().optional(),
  riskSensitivity: z.enum(["strict", "balanced", "relaxed"]).optional(),
  name: z.string().trim().min(2).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

export async function PUT(req: NextRequest) {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const parsed = UpdateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input.");
  }
  const { name, currentPassword, newPassword, ...settingsUpdate } = parsed.data;

  if (name) {
    await db.update(schema.users).set({ name }).where(eq(schema.users.id, user.id));
  }

  if (newPassword) {
    if (!currentPassword) {
      return jsonError("Enter your current password to set a new one.");
    }
    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) {
      return jsonError("Current password is incorrect.", 401);
    }
    const passwordHash = await hashPassword(newPassword);
    await db
      .update(schema.users)
      .set({ passwordHash })
      .where(eq(schema.users.id, user.id));
  }

  const existing = await db
    .select({ id: schema.settings.id })
    .from(schema.settings)
    .where(eq(schema.settings.userId, user.id))
    .limit(1);

  let updated;
  if (existing.length) {
    [updated] = await db
      .update(schema.settings)
      .set({ ...settingsUpdate, updatedAt: new Date().toISOString() })
      .where(eq(schema.settings.userId, user.id))
      .returning();
  } else {
    [updated] = await db
      .insert(schema.settings)
      .values({ userId: user.id, ...settingsUpdate })
      .returning();
  }

  return jsonOk({ settings: updated });
}
