import { createWorker } from "tesseract.js";
import path from "path";

/**
 * By default tesseract.js downloads the English model
 * (eng.traineddata.gz, ~3MB) from jsDelivr on first use. That adds a slow,
 * network-dependent cold start on serverless platforms and can fail
 * entirely in network-restricted environments. We instead bundle the
 * model via the `@tesseract.js-data/eng` npm package and point tesseract
 * at it directly, so OCR works fully offline once deployed.
 */
const LANG_PATH = path.join(
  process.cwd(),
  "node_modules/@tesseract.js-data/eng/4.0.0_best_int"
);

/**
 * Extract text from an uploaded image (screenshot of an SMS/WhatsApp/email
 * scam, etc.) using Tesseract's OCR engine, running fully server-side in
 * the Node.js runtime.
 */
export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  const worker = await createWorker("eng", 1, { langPath: LANG_PATH });
  try {
    const {
      data: { text },
    } = await worker.recognize(buffer);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}

/**
 * Extract text from a PDF. Most scam-report PDFs (e-mail printouts, bank
 * notices, chat exports) carry a real text layer, so we parse that
 * directly rather than rasterizing + OCR'ing every page.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Lazy import: pdf-parse-fork touches the filesystem at module load in
  // some environments, so we defer it until actually needed.
  const pdfParse = (await import("pdf-parse-fork")).default;
  const result = await pdfParse(buffer);
  return (result.text || "").trim();
}

export type SupportedUploadKind = "image" | "pdf";

export function detectUploadKind(mimeType: string): SupportedUploadKind | null {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  return null;
}
