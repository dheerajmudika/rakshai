import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";

// Re-export the edge-safe session primitives so existing imports of
// `@/lib/auth` (route handlers, server components — all Node runtime)
// keep working unchanged.
export {
  SESSION_COOKIE,
  signSession,
  verifySessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  type SessionPayload,
} from "@/lib/session";
import { getSession } from "@/lib/session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Fetch the full current user record from the DB, or null if unauthenticated. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.sub))
    .limit(1);
  return rows[0] ?? null;
}
