/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // tesseract.js dynamically requires a worker-script file relative to its
  // own node_modules location at runtime — bundling it with webpack breaks
  // that resolution. better-sqlite3 ships a native .node binary and must
  // also stay external. Keeping both external makes them load via plain
  // `require()` from node_modules instead of being bundled.
  serverExternalPackages: [
    "tesseract.js",
    "@tesseract.js-data/eng",
    "better-sqlite3",
    "pdf-parse-fork",
  ],
  // Vercel's serverless bundler traces file dependencies from `require()`
  // calls. We reference the bundled OCR language model via a raw path
  // string (not a require), so it must be explicitly included or it will
  // be silently dropped from the deployed function.
  outputFileTracingIncludes: {
    "app/api/scan/ocr/route": ["./node_modules/@tesseract.js-data/eng/**"],
  },
};
export default nextConfig;
