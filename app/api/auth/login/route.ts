import { NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-utils";

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input.");
  }
  const { email, password } = parsed.data;

  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  const user = rows[0];

  // Constant-shape error to avoid leaking which part was wrong.
  const invalidCreds = () => jsonError("Invalid email or password.", 401);

  if (!user) return invalidCreds();

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return invalidCreds();

  await setSessionCookie({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return jsonOk({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
