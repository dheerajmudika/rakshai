"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteReportButton({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/reports/${reportId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/reports");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-threat-critical/30 bg-threat-critical/5 px-3.5 py-2 text-sm font-medium text-threat-critical hover:bg-threat-critical/10 transition-all"
      >
        <Trash2 className="h-4 w-4" />
        Delete Report
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-threat-critical/40 bg-threat-critical/10 px-3.5 py-2">
      <span className="text-xs text-threat-critical font-medium">Delete permanently?</span>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs font-semibold text-threat-critical hover:underline disabled:opacity-50"
      >
        {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes, delete"}
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="text-xs text-white/50 hover:text-white"
      >
        Cancel
      </button>
    </div>
  );
}
