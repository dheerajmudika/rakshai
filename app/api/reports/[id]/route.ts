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

  const isStaff = user.role === "police" || user.role === "bank";

  const query = db
    .select({ report: schema.reports, scan: schema.scans })
    .from(schema.reports)
    .innerJoin(schema.scans, eq(schema.reports.scanId, schema.scans.id));

  if (isStaff) {
    query.where(eq(schema.reports.id, id));
  } else {
    query.where(and(eq(schema.reports.id, id), eq(schema.reports.userId, user.id)));
  }

  const rows = await query.limit(1);

  if (!rows[0]) return jsonError("Report not found.", 404);
  return jsonOk({ report: { ...rows[0].report, scan: rows[0].scan } });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;
  const { id } = await params;

  const isStaff = user.role === "police" || user.role === "bank";

  const query = db
    .delete(schema.reports);

  if (isStaff) {
    query.where(eq(schema.reports.id, id));
  } else {
    query.where(and(eq(schema.reports.id, id), eq(schema.reports.userId, user.id)));
  }

  const deleted = await query.returning({ id: schema.reports.id });

  if (!deleted.length) return jsonError("Report not found.", 404);
  return jsonOk({ success: true });
}
