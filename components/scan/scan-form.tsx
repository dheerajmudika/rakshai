"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ScanLine, Upload, ShieldAlert, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResultCard, type ScanResultView } from "@/components/scan/result-card";

type Mode = "text" | "file";

export function ScanForm() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResultView | null>(null);
  const [extractedText, setExtractedText] = useState<string | undefined>();
  const [scanId, setScanId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setResult(null);
    setExtractedText(undefined);
    setError("");
    setSaved(false);
    setScanId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    reset();

    if (mode === "text" && !text.trim()) {
      setError("Paste some text or a URL to scan.");
      return;
    }
    if (mode === "file" && !file) {
      setError("Choose an image or PDF to scan.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "text") {
        const looksLikeUrl = /^(https?:\/\/|www\.)/i.test(text.trim());
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: text,
            inputType: looksLikeUrl ? "url" : "text",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Scan failed.");
        setResult(data.result);
        setScanId(data.scan.id);
      } else if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/scan/ocr", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "OCR scan failed.");
        setResult(data.result);
        setExtractedText(data.extractedText);
        setScanId(data.scan.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveReport() {
    if (!scanId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("text");
              reset();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === "text"
                ? "bg-signal/10 text-signal-soft border border-signal/30"
                : "text-white/50 border border-void-border hover:text-white"
            }`}
          >
            Paste Text / URL
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("file");
              reset();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === "file"
                ? "bg-signal/10 text-signal-soft border border-signal/30"
                : "text-white/50 border border-void-border hover:text-white"
            }`}
          >
            Upload Screenshot / PDF
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "text" ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the suspicious SMS, WhatsApp message, email, or URL here..."
              rows={7}
              className="w-full rounded-xl border border-void-border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-signal/50 focus:bg-white/[0.05] focus:shadow-glow resize-none"
            />
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-void-border px-6 py-10 text-center hover:border-signal/40 hover:bg-white/[0.02] transition-all"
            >
              <Upload className="h-8 w-8 text-white/30" />
              {file ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-white/40 hover:text-threat-critical"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-white/60">
                    Click to upload a screenshot (PNG/JPG) or PDF
                  </p>
                  <p className="text-xs text-white/30">Max file size 10MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-xl border border-threat-critical/30 bg-threat-critical/10 px-3.5 py-2.5 text-xs text-threat-critical"
              >
                <ShieldAlert className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <ScanLine className="h-4 w-4" /> Scan Now
              </>
            )}
          </Button>
        </form>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <ResultCard result={result} extractedText={extractedText} />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveReport}
                disabled={saving || saved}
              >
                {saved ? (
                  "Saved to Reports"
                ) : saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save as Report
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
