"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/store/types";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      [
        o.id,
        o.customer.name,
        o.customer.email,
        o.customer.phone,
        o.delivery.city,
        o.status,
        o.tracking,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [orders, query]);

  return (
    <div className="space-y-4">
      <label className="relative block max-w-md">
        <span className="sr-only">Search orders</span>
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
          placeholder="Filter by name, phone, city, status…"
          className="h-11 w-full rounded-sm border border-ink/15 bg-ivory pl-9 pr-3 text-sm outline-none focus:border-wine"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="border border-ink/10 bg-ivory p-8 text-sm text-ink/55">
          {orders.length === 0
            ? "No orders yet."
            : `No orders match “${query}”.`}
        </p>
      ) : (
        <div className="overflow-x-auto border border-ink/10 bg-ivory">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-ink/45">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-ink/10 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.customer.name}</p>
                    <p className="text-xs text-ink/45">{o.customer.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{o.delivery.city}</td>
                  <td className="px-4 py-3 capitalize text-ink/70">
                    {o.status}
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {o.subtotal === undefined
                      ? "On request"
                      : formatPrice(o.subtotal, o.currency)}
                  </td>
                  <td className="px-4 py-3 text-ink/55">
                    {new Date(o.createdAt).toLocaleString("en-PK")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-wine hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
