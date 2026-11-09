"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setStatus(
        "Thank you — your message is noted. For the fastest reply, WhatsApp us as well.",
      );
    }, 450);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-ink/55">
            Name
          </span>
          <Input name="name" required autoComplete="name" placeholder="Your name" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-ink/55">
            Email
          </span>
          <Input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-ink/55">
          Phone / WhatsApp
          <span className="normal-case tracking-normal text-ink/40"> (optional)</span>
        </span>
        <Input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="03XX XXXXXXX"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-ink/55">
          How can we help?
        </span>
        <Textarea
          name="message"
          required
          rows={6}
          placeholder="Fabric shade, custom length, order help…"
        />
      </label>
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={busy} className="min-w-[10rem]">
          {busy ? "Sending…" : "Send message"}
        </Button>
        <p className="text-xs text-ink/50">
          We usually reply within the day on WhatsApp and email.
        </p>
      </div>
      {status ? (
        <p className="border-t border-ink/10 pt-4 text-sm text-ink/70" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
