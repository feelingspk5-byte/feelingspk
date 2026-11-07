"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import {
  IconBag,
  IconChevronDown,
  IconClose,
  IconMenu,
  IconSearch,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart-context";
import type { Collection } from "@/lib/types";

const shopPanel = [
  {
    href: "/shop",
    label: "Shop All",
    note: "Full elite men's catalogue",
  },
  {
    href: "/shop?category=unstitched_fabric",
    label: "Unstitched Fabric",
    note: "Cloth for custom stitching",
  },
  {
    href: "/shop?category=stitched_shalwar_kameez",
    label: "Stitched Shalwar Kameez",
    note: "Ready suits with sizes",
  },
  {
    href: "/shop?category=dress_shirt",
    label: "Dress Shirts",
    note: "Formal shirts with collar sizes",
  },
  {
    href: "/shop?filter=new",
    label: "New Arrivals",
    note: "Latest releases",
  },
  {
    href: "/collections",
    label: "Collections",
    note: "Browse by line",
  },
];

const houseLinks = [
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping" },
  { href: "/contact", label: "Contact" },
];

const primaryLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({ collections }: { collections: Collection[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const shopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setShopOpen(false);
    setOpen(false);
  }, [pathname]);

  function openShop() {
    if (shopTimer.current) clearTimeout(shopTimer.current);
    shopTimer.current = setTimeout(() => setShopOpen(true), 180);
  }

  function closeShop() {
    if (shopTimer.current) clearTimeout(shopTimer.current);
    shopTimer.current = setTimeout(() => setShopOpen(false), 220);
  }

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = String(form.get("q") ?? "").trim();
    setSearchOpen(false);
    setOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <header className="relative sticky top-0 z-50 border-b border-ink/10 bg-ivory/95 backdrop-blur-md">
      <Container className="flex h-[4.75rem] items-center justify-between gap-4 sm:h-20 lg:h-[5.25rem]">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>

        <Link
          href="/"
          className="absolute left-1/2 inline-flex -translate-x-1/2 items-center lg:static lg:translate-x-0"
          onClick={() => setOpen(false)}
          aria-label="FEELINGS home"
        >
          <BrandLogo variant="header" priority />
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          <div
            className="relative"
            onMouseEnter={openShop}
            onMouseLeave={closeShop}
          >
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 px-3 py-2 text-[12px] uppercase tracking-[0.16em] text-ink/75 transition-colors duration-feel hover:text-ink",
                (pathname.startsWith("/shop") ||
                  pathname.startsWith("/collections") ||
                  shopOpen) &&
                  "text-wine",
              )}
              aria-expanded={shopOpen}
              aria-haspopup="true"
              onClick={() => setShopOpen((v) => !v)}
            >
              Shop
              <IconChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-feel",
                  shopOpen && "rotate-180",
                )}
              />
            </button>
          </div>

          {primaryLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-[12px] uppercase tracking-[0.16em] text-ink/75 transition-colors duration-feel hover:text-ink",
                (link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`)) &&
                  "text-wine",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink"
            aria-label="Search fabrics"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <IconSearch />
          </button>
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink"
            aria-label={`Cart${itemCount ? `, ${itemCount} items` : ""}`}
          >
            <IconBag />
            {itemCount > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[10px] font-medium text-ivory">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </Container>

      {shopOpen ? (
        <div
          className="absolute left-0 right-0 hidden border-b border-ink/10 bg-ivory shadow-[0_18px_40px_rgba(23,23,23,0.08)] lg:block"
          onMouseEnter={openShop}
          onMouseLeave={closeShop}
        >
          <Container className="grid grid-cols-[1.2fr_0.8fr] gap-10 py-8">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-ink/45">
                Shop fabrics
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {shopPanel.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-sm border border-ink/10 bg-stone/40 px-4 py-5 transition-colors duration-feel hover:border-wine/40 hover:bg-stone"
                    onClick={() => setShopOpen(false)}
                  >
                    <span className="block text-sm font-medium tracking-wide text-ink group-hover:text-wine">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs text-ink/55">
                      {item.note}
                    </span>
                  </Link>
                ))}
              </div>
              {collections.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
                  {collections.slice(0, 6).map((c) => (
                    <Link
                      key={c.id}
                      href={`/collections/${c.slug}`}
                      className="text-xs uppercase tracking-[0.14em] text-ink/65 hover:text-wine"
                      onClick={() => setShopOpen(false)}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="border-l border-ink/10 pl-8">
              <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-ink/45">
                The house
              </p>
              <ul className="space-y-3">
                {houseLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/75 transition-colors hover:text-wine"
                      onClick={() => setShopOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-ink/50">
                Elite Men&apos;s Collection — unstitched fabric, stitched
                shalwar kameez, and dress shirts.
              </p>
            </div>
          </Container>
        </div>
      ) : null}

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
        <div className="border-t border-ink/10 bg-ivory lg:hidden">
          <Container className="space-y-1 py-4">
            <Link
              href="/"
              className="block py-2.5 text-sm uppercase tracking-[0.12em] text-ink"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <div className="my-2 border-t border-ink/10" />
            <p className="pb-1 text-[11px] uppercase tracking-[0.18em] text-ink/45">
              Shop
            </p>
            {shopPanel.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2.5 text-sm uppercase tracking-[0.12em] text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/collections"
              className="block py-2.5 text-sm uppercase tracking-[0.12em] text-ink"
              onClick={() => setOpen(false)}
            >
              Collections
            </Link>
            <div className="my-2 border-t border-ink/10" />
            <p className="pb-1 text-[11px] uppercase tracking-[0.18em] text-ink/45">
              The house
            </p>
            {houseLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2.5 text-sm uppercase tracking-[0.12em] text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
