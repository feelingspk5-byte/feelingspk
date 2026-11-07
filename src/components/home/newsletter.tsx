"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(
      "Email list is not connected yet. Your address was not submitted.",
    );
  }

  return (
    <section className="border-t border-ink/10 bg-ink py-16 text-ivory md:py-20">
      <Container className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/45">
            Newsletter
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            New fabric arrivals, quietly announced.
          </h2>
          <p className="mt-3 max-w-md text-sm text-ivory/60">
            Join for collection updates. Privacy details will follow the
            published FEELINGS policy.
          </p>
        </div>
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
          <Input
            type="email"
            name="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            className="border-ivory/20 bg-ivory text-ink"
          />
          <Button type="submit" variant="wine" className="sm:w-36">
            Join
          </Button>
        </form>
        {status ? (
          <p className="text-sm text-ivory/70 lg:col-span-2" role="status">
            {status}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
