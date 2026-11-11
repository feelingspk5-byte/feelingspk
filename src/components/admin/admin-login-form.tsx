"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm({ setup }: { setup: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (setup && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const res = await fetch(setup ? "/api/admin/setup" : "/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not continue.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-wine">
          {setup ? "First-time setup" : "Staff access"}
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-ink">
          {setup ? "Create admin password" : "Sign in to admin"}
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          {setup
            ? "Choose a password (8+ characters). The client will use this to manage inventory without opening code."
            : "Enter the admin password to manage products, stock, media, and COD orders."}
        </p>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
          Password
        </span>
        <Input
          type="password"
          required
          minLength={setup ? 8 : 1}
          autoComplete={setup ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {setup ? (
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Confirm password
          </span>
          <Input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>
      ) : null}

      {error ? <p className="text-sm text-wine">{error}</p> : null}

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? "Please wait…" : setup ? "Create admin access" : "Sign in"}
      </Button>
    </form>
  );
}
