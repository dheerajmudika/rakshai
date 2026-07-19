"use client";

import { useState, type FormEvent, type ElementType } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  ShieldAlert,
  UserRound,
  Building2,
  Landmark,
  Check,
} from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Role = "citizen" | "police" | "bank";

const roles: {
  id: Role;
  title: string;
  desc: string;
  icon: ElementType;
}[] = [
  {
    id: "citizen",
    title: "Citizen",
    desc: "Report fraud & scan threats",
    icon: UserRound,
  },
  {
    id: "police",
    title: "Police Officer",
    desc: "Investigate cyber cases",
    icon: Building2,
  },
  {
    id: "bank",
    title: "Bank Employee",
    desc: "Monitor financial fraud",
    icon: Landmark,
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("citizen");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("All fields are required to create your account.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match. Please re-check.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create account. Please try again.");
        setLoading(false);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell panelLabel="New Registration">
      <h1 className="font-display text-2xl font-semibold text-white">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-white/50">
        Join India&apos;s AI-powered digital public safety network
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              id="name"
              placeholder="Aarav Sharma"
              className="pl-10"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              id="email"
              type="email"
              placeholder="you@domain.com"
              className="pl-10"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label>Register As</Label>
          <div className="grid grid-cols-1 gap-2.5">
            {roles.map(({ id, title, desc, icon: Icon }) => {
              const active = role === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setRole(id)}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl border px-4 py-3 text-left transition-all duration-300",
                    active
                      ? "border-signal/50 bg-signal/10 shadow-glow"
                      : "border-void-border bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      active
                        ? "bg-gradient-to-br from-signal to-intel text-white"
                        : "bg-white/5 text-white/50"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-xs text-white/40">{desc}</p>
                  </div>
                  {active && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-signal text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating your account...
            </>
          ) : (
            <>
              Create Account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-white/40">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-signal-soft hover:text-signal transition-colors">
          Sign in instead
        </Link>
      </p>
    </AuthShell>
  );
}
