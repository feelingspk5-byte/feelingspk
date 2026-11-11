"use client";

import { useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

type Hit = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  href: string;
};

const TYPE_LABEL: Record<string, string> = {
  page: "Page",
  product: "Product",
  order: "Order",
  customer: "Customer",
  collection: "Collection",
  offer: "Offer",
};

export function AdminSearch() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHits([]);
    setActive(0);
    dialogRef.current?.close();
  }, []);

  const openSearch = useCallback(() => {
    setOpen(true);
    dialogRef.current?.showModal();
    window.setTimeout(() => inputRef.current?.focus(), 10);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openSearch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openSearch]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    const ctrl = new AbortController();
    setLoading(true);
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/admin/search?q=${encodeURIComponent(q)}`,
          { signal: ctrl.signal },
        );
        const data = (await res.json()) as { hits?: Hit[] };
        setHits(data.hits ?? []);
        setActive(0);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 120);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [query, open]);

  function go(hit: Hit) {
    close();
    router.push(hit.href);
    router.refresh();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (hits[active]) go(hits[active]);
  }

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="inline-flex h-9 items-center gap-2 rounded-sm border border-ink/15 bg-stone/40 px-3 text-sm text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
        aria-label="Search admin"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded-sm border border-ink/15 px-1.5 py-0.5 text-[10px] text-ink/45 md:inline">
          ⌘K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="w-[min(100vw-2rem,32rem)] max-h-[min(80vh,28rem)] overflow-hidden rounded-sm border border-ink/15 bg-ivory p-0 text-ink shadow-none open:flex open:flex-col backdrop:bg-ink/40"
        onClose={close}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <form onSubmit={onSubmit} className="border-b border-ink/10 p-3">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Escape") {
                close();
              }
            }}
            placeholder="Search products, orders, customers, pages…"
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
            aria-controls={listId}
            aria-autocomplete="list"
            role="combobox"
            aria-expanded={open}
          />
          <p className="mt-1 text-[11px] text-ink/40">
            {loading ? "Searching…" : "↑↓ to move · Enter to open · Esc to close"}
          </p>
        </form>

        <ul
          id={listId}
          role="listbox"
          className="flex-1 overflow-y-auto py-2"
        >
          {hits.length === 0 ? (
            <li className="px-4 py-6 text-sm text-ink/50">
              {query.trim()
                ? "No matches. Try a name, SKU, phone, or order id."
                : "Type to search the whole admin."}
            </li>
          ) : (
            hits.map((hit, idx) => (
              <li key={`${hit.type}-${hit.id}`} role="option" aria-selected={idx === active}>
                <button
                  type="button"
                  onClick={() => go(hit)}
                  onMouseEnter={() => setActive(idx)}
                  className={[
                    "flex w-full items-start justify-between gap-3 px-4 py-2.5 text-left text-sm",
                    idx === active ? "bg-stone" : "hover:bg-stone/60",
                  ].join(" ")}
                >
                  <span>
                    <span className="block font-medium text-ink">{hit.title}</span>
                    {hit.subtitle ? (
                      <span className="mt-0.5 block text-xs text-ink/50">
                        {hit.subtitle}
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-ink/40">
                    {TYPE_LABEL[hit.type] ?? hit.type}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </dialog>
    </>
  );
}
