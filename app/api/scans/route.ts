import { NextRequest } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { jsonOk, requireUser, isError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;

  const isStaff = user.role === "police" || user.role === "bank";

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const verdict = searchParams.get("verdict");

  const conditions = [];
  if (!isStaff) {
    conditions.push(eq(schema.scans.userId, user.id));
  }
  if (verdict === "scam" || verdict === "safe") {
    conditions.push(eq(schema.scans.verdict, verdict));
  }

  const query = db
    .select()
    .from(schema.scans);

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const rows = await query
    .orderBy(desc(schema.scans.createdAt))
    .limit(limit);

  return jsonOk({ scans: rows });
}
