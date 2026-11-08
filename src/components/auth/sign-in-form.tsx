"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export function SignInForm({ nextPath = "/account" }: { nextPath?: string }) {
  const { signIn, signUp, user, signOut } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <div className="rounded-sm border border-ink/10 bg-ivory p-6">
        <p className="text-sm text-ink/60">Signed in as</p>
        <p className="mt-1 font-display text-2xl text-ink">{user.name}</p>
        <p className="text-sm text-ink/65">{user.email}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => router.push(nextPath || "/account")}>
            Continue
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const result =
      mode === "signin"
        ? signIn(email, password)
        : signUp(name, email, password);

    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(nextPath || "/account");
  }

  return (
    <div className="rounded-sm border border-ink/10 bg-ivory p-6">
      <div className="mb-6 flex gap-2 border-b border-ink/10 pb-3">
        <button
          type="button"
          className={`px-3 py-1.5 text-sm ${mode === "signin" ? "text-wine" : "text-ink/55"}`}
          onClick={() => {
            setMode("signin");
            setError(null);
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 text-sm ${mode === "signup" ? "text-wine" : "text-ink/55"}`}
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
        >
          Create account
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" ? (
          <label className="block text-sm">
            <span className="mb-1.5 block text-ink/70">Full name</span>
            <Input name="name" required autoComplete="name" />
          </label>
        ) : null}
        <label className="block text-sm">
          <span className="mb-1.5 block text-ink/70">Email</span>
          <Input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-ink/70">Password</span>
          <Input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />
        </label>

        {error ? <p className="text-sm text-wine">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={busy}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-xs leading-relaxed text-ink/50">
        Accounts are saved on this device for checkout readiness. Payment
        processing will connect when FEELINGS enables a payment provider.{" "}
        <Link href="/privacy" className="text-ink/70 hover:text-wine">
          Privacy
        </Link>
      </p>
    </div>
  );
}
