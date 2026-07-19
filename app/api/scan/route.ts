import { NextRequest } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db/client";
import { detectScam } from "@/lib/ai/gemini";
import { jsonError, jsonOk, requireUser, isError } from "@/lib/api-utils";

const ScanSchema = z.object({
  input: z.string().trim().min(3, "Please enter at least a few characters to scan."),
  inputType: z.enum(["text", "url"]).default("text"),
  saveReport: z.boolean().optional().default(false),
  title: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const parsed = ScanSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input.");
  }
  const { input, inputType, saveReport, title } = parsed.data;

  let result;
  try {
    result = await detectScam(input);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Detection failed.";
    return jsonError(message, 500);
  }

  const [scan] = await db
    .insert(schema.scans)
    .values({
      userId: user.id,
      inputType,
      inputText: input,
      verdict: result.verdict,
      confidence: result.confidence,
      riskLevel: result.riskLevel,
      category: result.category,
      explanation: result.explanation,
      action: result.recommendedAction,
      source: result.source,
    })
    .returning();

  let report = null;
  if (saveReport) {
    const [r] = await db
      .insert(schema.reports)
      .values({
        userId: user.id,
        scanId: scan.id,
        title: title?.trim() || `Scan report — ${new Date(scan.createdAt).toLocaleString()}`,
      })
      .returning();
    report = r;
  }

  return jsonOk({ scan, result, report }, 201);
}
