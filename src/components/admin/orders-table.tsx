"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CallClientActions } from "@/components/admin/call-client-button";
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
              "rounded-sm border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors",
              filter === f.id
                ? "border-ink bg-ink text-ivory"
                : "border-ink/15 bg-ivory/70 text-ink/60 hover:border-ink/40",
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
          className="h-11 min-w-[16rem] max-w-md flex-1 rounded-sm border border-ink/12 bg-ivory px-3 text-sm outline-none transition-colors focus:border-wine"
        />
        <button
          type="button"
          className="inline-flex h-11 items-center rounded-sm border border-ink/20 bg-ivory px-4 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
          onClick={() => {
            window.location.assign("/api/admin/orders/export");
          }}
        >
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-sm border border-ink/10 bg-ivory p-8 text-sm text-ink/55">
          {orders.length === 0
            ? "No orders yet."
            : "No orders match this view."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-ink/10 bg-ivory shadow-[0_1px_0_rgba(23,23,23,0.04)]">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-ink/10 bg-[#f3eee4] text-[11px] uppercase tracking-[0.14em] text-ink/45">
              <tr>
                <th className="px-4 py-3.5 font-medium">Customer</th>
                <th className="px-4 py-3.5 font-medium">City</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-4 py-3.5 font-medium">Total</th>
                <th className="px-4 py-3.5 font-medium">Placed</th>
                <th className="px-4 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-ink/8 transition-colors last:border-0 hover:bg-[#faf7f1]"
                >
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-ink">{o.customer.name}</p>
                    <p className="mt-0.5 text-xs text-ink/45">
                      {o.customer.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-ink/70">{o.delivery.city}</td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-4 py-3.5 text-ink/70">
                    {o.subtotal === undefined
                      ? "—"
                      : formatPrice(o.subtotal, o.currency)}
                  </td>
                  <td className="px-4 py-3.5 text-ink/55">
                    {new Date(o.createdAt).toLocaleString("en-PK")}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <CallClientActions
                        phone={o.customer.phone}
                        name={o.customer.name}
                        compact
                      />
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex h-8 items-center rounded-sm border border-ink/15 px-2.5 text-[11px] uppercase tracking-[0.12em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
                      >
                        Open
                      </Link>
                    </div>
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

function StatusPill({ status }: { status: OrderStatus }) {
  const tone =
    status === "pending"
      ? "bg-wine/10 text-wine"
      : status === "confirmed" || status === "delivered"
        ? "bg-ink/8 text-ink"
        : status === "cancelled"
          ? "bg-ink/5 text-ink/45"
          : "bg-stone-soft text-ink/70";

  return (
    <span
      className={`inline-flex rounded-sm px-2 py-0.5 text-[11px] capitalize tracking-wide ${tone}`}
    >
      {status}
    </span>
  );
}
