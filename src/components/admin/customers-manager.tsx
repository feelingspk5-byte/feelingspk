"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CallClientActions } from "@/components/admin/call-client-button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import type { CustomerRecord } from "@/lib/store/types";

export function CustomersManager({ initial }: { initial: CustomerRecord[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [tagDrafts, setTagDrafts] = useState<Record<string, string>>({});

  async function saveTags(id: string) {
    const raw =
      tagDrafts[id] ?? items.find((c) => c.id === id)?.tags.join(", ") ?? "";
    const tags = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    await fetch("/api/admin/customers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tags }),
    });
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, tags } : c)));
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-ink/10 bg-ivory shadow-[0_1px_0_rgba(23,23,23,0.04)]">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-ink/10 bg-[#f3eee4] text-[11px] uppercase tracking-[0.14em] text-ink/45">
          <tr>
            <th className="px-4 py-3.5 font-medium">Customer</th>
            <th className="px-4 py-3.5 font-medium">Orders</th>
            <th className="px-4 py-3.5 font-medium">Spent</th>
            <th className="px-4 py-3.5 font-medium">Tags</th>
            <th className="px-4 py-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr
              key={c.id}
              className="border-b border-ink/8 transition-colors last:border-0 hover:bg-[#faf7f1]"
            >
              <td className="px-4 py-3.5">
                <p className="font-medium">{c.name}</p>
                <p className="mt-0.5 text-xs text-ink/45">
                  {c.email}
                  {c.city ? ` · ${c.city}` : ""}
                </p>
                <p className="mt-0.5 text-xs text-ink/55">{c.phone}</p>
              </td>
              <td className="px-4 py-3.5">{c.orderCount}</td>
              <td className="px-4 py-3.5">{formatPrice(c.totalSpent)}</td>
              <td className="px-4 py-3.5">
                <Input
                  className="min-w-[160px]"
                  defaultValue={c.tags.join(", ")}
                  placeholder="VIP, wholesale"
                  onChange={(e) =>
                    setTagDrafts((prev) => ({
                      ...prev,
                      [c.id]: e.target.value,
                    }))
                  }
                />
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <CallClientActions phone={c.phone} name={c.name} compact />
                  <button
                    type="button"
                    className="inline-flex h-8 items-center rounded-sm border border-ink/15 px-2.5 text-[11px] uppercase tracking-[0.12em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
                    onClick={() => saveTags(c.id)}
                  >
                    Save tags
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-ink/55">
                Customers appear here after COD checkouts.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
