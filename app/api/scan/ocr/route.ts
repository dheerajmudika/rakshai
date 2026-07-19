import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db/client";
import { detectScam } from "@/lib/ai/gemini";
import { extractTextFromImage, extractTextFromPdf, detectUploadKind } from "@/lib/ai/ocr";
import { jsonError, jsonOk, requireUser, isError } from "@/lib/api-utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;

  const formData = await req.formData();
  const file = formData.get("file");
  const saveReport = formData.get("saveReport") === "true";

  if (!(file instanceof File)) {
    return jsonError("No file uploaded. Attach an image or PDF.");
  }
  if (file.size === 0) {
    return jsonError("The uploaded file is empty.");
  }
  if (file.size > MAX_FILE_SIZE) {
    return jsonError("File too large. Maximum size is 10MB.");
  }

  const kind = detectUploadKind(file.type);
  if (!kind) {
    return jsonError(
      "Unsupported file type. Upload an image (PNG/JPG) or a PDF."
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let extractedText: string;
  try {
    extractedText =
      kind === "image"
        ? await extractTextFromImage(buffer)
        : await extractTextFromPdf(buffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    const friendly =
      kind === "pdf"
        ? "This PDF appears to be corrupted or uses an unsupported structure. Try re-saving/printing it as a fresh PDF, or upload a screenshot instead."
        : `Failed to extract text from the image: ${message}`;
    return jsonError(friendly, 500);
  }

  if (!extractedText || extractedText.trim().length < 3) {
    return jsonError(
      "Could not extract readable text from this file. Try a clearer screenshot or a text-based PDF."
    );
  }

  let result;
  try {
    result = await detectScam(extractedText);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Detection failed.";
    return jsonError(message, 500);
  }

  const [scan] = await db
    .insert(schema.scans)
    .values({
      userId: user.id,
      inputType: kind === "image" ? "ocr_image" : "ocr_pdf",
      inputText: `[Uploaded file: ${file.name}]`,
      extractedText,
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
        title: `OCR scan — ${file.name}`,
      })
      .returning();
    report = r;
  }

  return jsonOk({ scan, extractedText, result, report }, 201);
}
