"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SettingsData {
  emailAlerts: boolean;
  smsAlerts: boolean;
  autoSaveReports: boolean;
  riskSensitivity: "strict" | "balanced" | "relaxed";
}

interface ProfileData {
  name: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data.settings);
        setProfile(data.profile);
        setName(data.profile.name);
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveSettings(update: Partial<SettingsData>) {
    if (!settings) return;
    const next = { ...settings, ...update };
    setSettings(next);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
  }

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload: Record<string, string> = {};
      if (name && name !== profile?.name) payload.name = name;
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      if (Object.keys(payload).length === 0) {
        setMessage({ type: "success", text: "Nothing to update." });
        return;
      }
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Update failed." });
        return;
      }
      setMessage({ type: "success", text: "Profile updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-signal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage your profile, security, and notification preferences.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-white">Profile</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (read-only)</Label>
              <Input id="email" value={profile?.email} disabled />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Required to set a new password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Leave blank to keep current password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
                  message.type === "error"
                    ? "border-threat-critical/30 bg-threat-critical/10 text-threat-critical"
                    : "border-threat-safe/30 bg-threat-safe/10 text-threat-safe"
                }`}
              >
                {message.type === "error" ? (
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                )}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-white">
          Notification Preferences
        </h2>
        <div className="space-y-4">
          <ToggleRow
            label="Email alerts for high-risk scans"
            checked={settings?.emailAlerts ?? false}
            onChange={(v) => saveSettings({ emailAlerts: v })}
          />
          <ToggleRow
            label="SMS alerts for critical scams"
            checked={settings?.smsAlerts ?? false}
            onChange={(v) => saveSettings({ smsAlerts: v })}
          />
          <ToggleRow
            label="Automatically save every scan as a report"
            checked={settings?.autoSaveReports ?? false}
            onChange={(v) => saveSettings({ autoSaveReports: v })}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-white">
          Detection Sensitivity
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(["strict", "balanced", "relaxed"] as const).map((level) => (
            <button
              key={level}
              onClick={() => saveSettings({ riskSensitivity: level })}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium capitalize transition-all ${
                settings?.riskSensitivity === level
                  ? "border-signal/50 bg-signal/10 text-signal-soft shadow-glow"
                  : "border-void-border text-white/60 hover:border-white/20"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/70">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-signal" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
