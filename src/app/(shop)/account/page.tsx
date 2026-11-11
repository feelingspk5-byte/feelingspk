"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function AccountPage() {
  const { user, ready, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/sign-in?next=/account");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <Container className="py-16">
        <p className="text-sm text-ink/60">Loading account…</p>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.18em] text-wine">Account</p>
      <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
        {user.name}
      </h1>
      <p className="mt-2 text-sm text-ink/65">{user.email}</p>
      <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink/70">
        You are signed in. Use this account when you are ready to complete
        payment at checkout.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => router.push("/shop")}>Continue shopping</Button>
        <Button variant="outline" onClick={() => router.push("/checkout")}>
          Go to checkout
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          Sign out
        </Button>
      </div>
      <p className="mt-8 text-sm text-ink/50">
        Need help?{" "}
        <Link href="/contact" className="text-wine hover:underline">
          Contact FEELINGS
        </Link>
      </p>
    </Container>
  );
}
