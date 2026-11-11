"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { availabilityLabel, formatPrice } from "@/lib/format";
import {
  PRODUCT_CATEGORY_LABELS,
  type Product,
} from "@/lib/types";

export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const colours = (p.colourVariants ?? []).map((c) => c.name).join(" ");
      return [p.name, p.sku, p.slug, colours, PRODUCT_CATEGORY_LABELS[p.category]]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [products, query]);

  return (
    <div className="space-y-4">
      <label className="relative block max-w-md">
        <span className="sr-only">Search products</span>
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
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
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, SKU, colour…"
          className="h-11 w-full rounded-sm border border-ink/15 bg-ivory pl-9 pr-3 text-sm outline-none focus:border-wine"
        />
      </label>

      <div className="overflow-x-auto border border-ink/10 bg-ivory">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-ink/45">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const img = p.images.find((i) => i.src)?.src;
              return (
                <tr
                  key={p.id}
                  className="border-b border-ink/10 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-stone">
                        {img ? (
                          <Image
                            src={img}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-ink/45">
                          {p.sku ?? p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {PRODUCT_CATEGORY_LABELS[p.category]}
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {availabilityLabel(p.availability)}
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm text-wine hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-ink/55">
                  No products match “{query}”.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
