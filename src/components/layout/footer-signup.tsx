"use client";

import { FormEvent, useState } from "react";

export function FooterSignup() {
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Email list is not connected yet. Your address was not submitted.");
  }

  return (
    <div>
      <p className="font-display text-sm tracking-[0.08em] text-ivory sm:text-base">
        Sign up
      </p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/65">
        Be the first to know about our biggest and best sales. We&apos;ll never
        send more than one email a month.
      </p>
      <form onSubmit={onSubmit} className="mt-6">
        <label className="sr-only" htmlFor="footer-email">
          Email address
        </label>
        <div className="flex items-center gap-3 border-b border-ivory/70 pb-2">
          <input
            id="footer-email"
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="w-full bg-transparent text-sm text-ivory placeholder:text-ivory/45 outline-none"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="shrink-0 text-ivory/80 transition-colors hover:text-ivory"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden
            >
              <rect x="3" y="5" width="18" height="14" rx="1.5" />
              <path d="M3.5 7.5 12 13l8.5-5.5" />
            </svg>
          </button>
        </div>
      </form>
      {status ? (
        <p className="mt-3 text-xs text-ivory/55" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
