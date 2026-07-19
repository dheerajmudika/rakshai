import { NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-utils";

const SignupSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  role: z.enum(["citizen", "police", "bank"]).default("citizen"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input.");
  }
  const { name, email, password, role } = parsed.data;

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return jsonError("An account with this email already exists.", 409);
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(schema.users)
    .values({ name, email, passwordHash, role })
    .returning();

  await db.insert(schema.settings).values({ userId: user.id });

  await setSessionCookie({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return jsonOk(
    {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    201
  );
}
