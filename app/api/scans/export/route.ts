import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireUser, isError } from "@/lib/api-utils";

export async function GET() {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;

  const isStaff = user.role === "police" || user.role === "bank";

  const query = db
    .select()
    .from(schema.scans);

  if (!isStaff) {
    query.where(eq(schema.scans.userId, user.id));
  }

  const scans = await query.orderBy(desc(schema.scans.createdAt));

  const header = ["Date (IST)", "Verdict", "Risk Level", "Category", "Confidence %", "Source", "Input (first 120 chars)"];

  const rows = scans.map((s) => {
    const date = new Date(s.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "short",
      timeStyle: "short",
    });
    const input = s.inputText.replace(/"/g, '""').slice(0, 120);
    return [
      `"${date}"`,
      s.verdict,
      s.riskLevel,
      s.category,
      s.confidence.toFixed(0),
      s.source,
      `"${input}"`,
    ].join(",");
  });

  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="rakshai-scans-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
