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
      "Newsletter integration is not connected yet. Your email was not submitted.",
    );
  }

  return (
    <section className="border-t border-ink/10 bg-ink py-16 text-ivory md:py-20">
      <Container className="max-w-2xl text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/50">
          Newsletter
        </p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">
          Stay informed on new fabric arrivals
        </h2>
        <p className="mt-3 text-sm text-ivory/65">
          Email signup is prepared structurally. The mailing list is not
          connected yet — submissions are not sent until FEELINGS configures a
          provider.
        </p>
        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={onSubmit}
        >
          <Input
            type="email"
            name="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            className="border-ivory/20 bg-ivory text-ink"
          />
          <Button type="submit" variant="wine" className="sm:w-40">
            Join
          </Button>
        </form>
        {status ? (
          <p className="mt-3 text-sm text-ivory/80" role="status">
            {status}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-ivory/45">
          By joining you agree to receive updates. See the Privacy Policy for
          how FEELINGS handles data once policies are published.
        </p>
      </Container>
    </section>
  );
}
