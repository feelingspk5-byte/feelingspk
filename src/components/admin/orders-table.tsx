"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/store/types";

type FilterId = "all" | OrderStatus;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "packing", label: "Packing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(() => {
    let list = orders;
    if (filter !== "all") list = list.filter((o) => o.status === filter);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((o) =>
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
  }, [orders, query, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={[
              "rounded-sm border px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
              filter === f.id
                ? "border-ink bg-ink text-ivory"
                : "border-ink/15 text-ink/60 hover:border-ink/40",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, phone, city, status…"
          className="h-11 min-w-[16rem] flex-1 max-w-md rounded-sm border border-ink/15 bg-ivory px-3 text-sm outline-none focus:border-wine"
        />
        <button
          type="button"
          className="inline-flex h-11 items-center border border-ink px-4 text-sm"
          onClick={() => {
            window.location.assign("/api/admin/orders/export");
          }}
        >
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="border border-ink/10 bg-ivory p-8 text-sm text-ink/55">
          {orders.length === 0
            ? "No orders yet."
            : `No orders match this view.`}
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
