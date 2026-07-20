import { NextRequest } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { jsonError, jsonOk, requireUser, isError } from "@/lib/api-utils";

export async function GET() {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;

  const isStaff = user.role === "police" || user.role === "bank";

  const rows = await db
    .select({
      report: schema.reports,
      scan: schema.scans,
    })
    .from(schema.reports)
    .innerJoin(schema.scans, eq(schema.reports.scanId, schema.scans.id))
    .where(isStaff ? undefined : eq(schema.reports.userId, user.id))
    .orderBy(desc(schema.reports.createdAt));

  return jsonOk({
    reports: rows.map(({ report, scan }) => ({ ...report, scan })),
  });
}

const CreateReportSchema = z.object({
  scanId: z.string().min(1),
  title: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;

  const isStaff = user.role === "police" || user.role === "bank";

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const parsed = CreateReportSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input.");
  }
  const { scanId, title, notes } = parsed.data;

  const scanRows = await db
    .select()
    .from(schema.scans)
    .where(eq(schema.scans.id, scanId))
    .limit(1);
  const scan = scanRows[0];
  if (!scan || (!isStaff && scan.userId !== user.id)) {
    return jsonError("Scan not found.", 404);
  }

  const existing = await db
    .select({ id: schema.reports.id })
    .from(schema.reports)
    .where(eq(schema.reports.scanId, scanId))
    .limit(1);
  if (existing.length) {
    return jsonError("A report already exists for this scan.", 409);
  }

  const [report] = await db
    .insert(schema.reports)
    .values({
      userId: user.id,
      scanId,
      title: title || `Scan report — ${new Date(scan.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
      notes,
    })
    .returning();

  return jsonOk({ report: { ...report, scan } }, 201);
}
