"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "feelings-launch-offer-seen";

function alreadySeen(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private / restricted WebViews */
  }
}

function triggerReached(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  // Show once the section enters the lower ~70% of the viewport
  return rect.top < vh * 0.72 && rect.bottom > 0;
}

export function LaunchOfferPopup({
  triggerId = "home-second-section",
}: {
  triggerId?: string;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (alreadySeen()) return;

    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      markSeen();
      cleanup();
    };

    const check = () => {
      if (triggerReached(trigger)) show();
    };

    // Scroll/resize fallback — WhatsApp in-app browsers often break IntersectionObserver
    const onScroll = () => check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) show();
        },
        { threshold: [0, 0.1, 0.2], rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(trigger);
    } catch {
      /* ignore — scroll fallback still runs */
    }

    // Initial + delayed checks (WebView may report layout late)
    check();
    const t1 = window.setTimeout(check, 400);
    const t2 = window.setTimeout(check, 1200);

    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      observer?.disconnect();
    }

    return cleanup;
  }, [triggerId]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Dismiss launch offer"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="launch-offer-panel relative z-[1] w-full max-w-md overflow-hidden border border-ink/10 bg-ivory shadow-[0_24px_60px_rgba(23,23,23,0.18)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 0% 0%, rgba(107,38,56,0.12), transparent 55%), linear-gradient(165deg, rgba(245,241,233,0.2), transparent 60%)",
          }}
        />

        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-[2] flex h-9 w-9 items-center justify-center text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label="Close"
        >
          <span aria-hidden className="text-lg leading-none">
            ×
          </span>
        </button>

        <div className="relative px-6 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-wine">
            Launch offer
          </p>
          <h2
            id={titleId}
            className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl"
          >
            25% off every article
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Opening the Elite Men&apos;s Collection with a house-wide welcome —
            twenty-five percent off every fabric line, with free delivery on
            your first order.
          </p>

          <ul className="mt-5 space-y-2 border-y border-ink/10 py-4 text-sm text-ink/75">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-wine" />
              <span>25% off every article across all collections</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-wine" />
              <span>Free delivery on your first order</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/collections"
              onClick={() => setOpen(false)}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center rounded-sm bg-wine px-6 text-sm font-medium tracking-wide text-ivory transition-colors duration-feel hover:bg-wine/90 sm:flex-1",
              )}
            >
              Shop the collections
            </Link>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setOpen(false)}
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
