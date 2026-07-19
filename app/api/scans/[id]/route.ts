import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { jsonError, jsonOk, requireUser, isError } from "@/lib/api-utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;
  const { id } = await params;

  const rows = await db
    .select()
    .from(schema.scans)
    .where(and(eq(schema.scans.id, id), eq(schema.scans.userId, user.id)))
    .limit(1);

  if (!rows[0]) return jsonError("Scan not found.", 404);
  return jsonOk({ scan: rows[0] });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;
  const { id } = await params;

  const deleted = await db
    .delete(schema.scans)
    .where(and(eq(schema.scans.id, id), eq(schema.scans.userId, user.id)))
    .returning({ id: schema.scans.id });

  if (!deleted.length) return jsonError("Scan not found.", 404);
  return jsonOk({ success: true });
}
