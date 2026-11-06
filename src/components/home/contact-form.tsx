"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(
      "Contact form is ready structurally. Email delivery is not connected until FEELINGS confirms support details.",
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-sm border border-ink/10 bg-ivory p-5"
    >
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">Name</span>
        <Input name="name" required autoComplete="name" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">Email</span>
        <Input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">Phone (optional)</span>
        <Input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">Message</span>
        <Textarea name="message" required rows={5} />
      </label>
      <Button type="submit">Send message</Button>
      {status ? (
        <p className="text-sm text-ink/70" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
