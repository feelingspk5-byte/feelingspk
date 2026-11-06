"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart-context";
import type { Collection } from "@/lib/types";

const primaryLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?filter=new", label: "New Arrivals" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header({ collections }: { collections: Collection[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = String(form.get("q") ?? "").trim();
    setSearchOpen(false);
    setOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-stone/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          href="/"
          className="font-display text-2xl tracking-[0.08em] text-ink md:text-[1.7rem]"
          onClick={() => setOpen(false)}
        >
          FEELINGS
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] uppercase tracking-[0.14em] text-ink/80 transition-colors duration-feel hover:text-ink",
                pathname === link.href.split("?")[0] && "text-wine",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink"
            aria-label="Search fabrics"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink"
            aria-label={`Cart${itemCount ? `, ${itemCount} items` : ""}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[10px] font-medium text-ivory">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </Container>

      {searchOpen ? (
        <div className="border-t border-ink/10 bg-ivory">
          <Container className="py-3">
            <form onSubmit={onSearch} className="flex gap-2">
              <Input
                name="q"
                placeholder="Search fabrics by name or SKU"
                aria-label="Search fabrics"
                autoFocus
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-sm bg-ink px-4 text-sm text-ivory"
              >
                Search
              </button>
            </form>
          </Container>
        </div>
      ) : null}

      {open ? (
        <div className="border-t border-ink/10 bg-stone lg:hidden">
          <Container className="space-y-1 py-4">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2.5 text-sm uppercase tracking-[0.14em] text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {collections.length > 0 ? (
              <div className="border-t border-ink/10 pt-3">
                <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-ink/50">
                  Collections
                </p>
                {collections.map((c) => (
                  <Link
                    key={c.id}
                    href={`/collections/${c.slug}`}
                    className="block py-2 text-sm text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
