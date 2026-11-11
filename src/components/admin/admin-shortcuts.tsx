"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MAP: Record<string, string> = {
  h: "/admin",
  p: "/admin/products",
  o: "/admin/orders",
  c: "/admin/customers",
  m: "/admin/media",
  w: "/admin/cms",
  s: "/admin/settings",
  a: "/admin/analytics",
  f: "/admin/offers",
};

export function AdminShortcuts() {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    let timer: number | undefined;

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if (typing) return;

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setHelp((v) => !v);
        return;
      }

      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey) {
        setArmed(true);
        window.clearTimeout(timer);
        timer = window.setTimeout(() => setArmed(false), 1500);
        return;
      }

      if (armed) {
        const href = MAP[e.key.toLowerCase()];
        if (href) {
          e.preventDefault();
          setArmed(false);
          router.push(href);
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [armed, router]);

  if (!help) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={() => setHelp(false)}
    >
      <div
        className="w-full max-w-md border border-ink/15 bg-ivory p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-wine">
          Keyboard shortcuts
        </p>
        <h2 className="mt-2 font-display text-2xl">Go anywhere fast</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink/70">
          <li>
            <kbd className="border border-ink/20 px-1.5">⌘</kbd>/
            <kbd className="border border-ink/20 px-1.5">Ctrl</kbd>+
            <kbd className="border border-ink/20 px-1.5">K</kbd> Search
          </li>
          <li>
            <kbd className="border border-ink/20 px-1.5">G</kbd> then{" "}
            <kbd className="border border-ink/20 px-1.5">H</kbd> Overview
          </li>
          <li>
            <kbd className="border border-ink/20 px-1.5">G</kbd> then{" "}
            <kbd className="border border-ink/20 px-1.5">P</kbd> Products
          </li>
          <li>
            <kbd className="border border-ink/20 px-1.5">G</kbd> then{" "}
            <kbd className="border border-ink/20 px-1.5">O</kbd> Orders
          </li>
          <li>
            <kbd className="border border-ink/20 px-1.5">G</kbd> then{" "}
            <kbd className="border border-ink/20 px-1.5">C</kbd> Customers
          </li>
          <li>
            <kbd className="border border-ink/20 px-1.5">G</kbd> then{" "}
            <kbd className="border border-ink/20 px-1.5">W</kbd> Website
          </li>
          <li>
            <kbd className="border border-ink/20 px-1.5">G</kbd> then{" "}
            <kbd className="border border-ink/20 px-1.5">F</kbd> Offers
          </li>
          <li>
            <kbd className="border border-ink/20 px-1.5">G</kbd> then{" "}
            <kbd className="border border-ink/20 px-1.5">S</kbd> Settings
          </li>
          <li>
            <kbd className="border border-ink/20 px-1.5">?</kbd> Toggle this help
          </li>
        </ul>
        <button
          type="button"
          className="mt-5 text-sm text-wine"
          onClick={() => setHelp(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
