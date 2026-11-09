"use client";

import { FormEvent, useState } from "react";
import { FadeIn } from "@/components/home/motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VectorBackdrop } from "@/components/ui/vector-backdrop";

export function NewsletterSignup() {
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(
      "Email list is not connected yet. Your address was not submitted.",
    );
  }

  return (
    <section className="relative overflow-hidden border-t border-ink/10 bg-ink py-16 text-ivory md:py-24">
      <VectorBackdrop variant="ink" className="opacity-80" />
      <Container className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/45">
            Newsletter
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">
            New from the house, quietly announced.
          </h2>
          <p className="mt-3 max-w-md text-sm text-ivory/60">
            Be first to hear about fabric drops, stitched releases, and shirt
            arrivals — never noisy, always considered.
          </p>
        </FadeIn>
        <FadeIn delay={0.12}>
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
            <p className="mt-3 text-sm text-ivory/70" role="status">
              {status}
            </p>
          ) : null}
        </FadeIn>
      </Container>
    </section>
  );
}
