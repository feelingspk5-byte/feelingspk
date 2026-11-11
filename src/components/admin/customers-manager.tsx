"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import type { CustomerRecord } from "@/lib/store/types";

export function CustomersManager({ initial }: { initial: CustomerRecord[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [tagDrafts, setTagDrafts] = useState<Record<string, string>>({});

  async function saveTags(id: string) {
    const raw = tagDrafts[id] ?? items.find((c) => c.id === id)?.tags.join(", ") ?? "";
    const tags = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    await fetch("/api/admin/customers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tags }),
    });
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, tags } : c)),
    );
    router.refresh();
  }

  return (
    <div className="overflow-x-auto border border-ink/10 bg-ivory">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-ink/45">
          <tr>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Orders</th>
            <th className="px-4 py-3 font-medium">Spent</th>
            <th className="px-4 py-3 font-medium">Tags</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {items.map((c) => {
            const wa = `https://wa.me/${c.phone.replace(/\D/g, "").replace(/^0/, "92")}`;
            return (
              <tr key={c.id} className="border-b border-ink/10 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-ink/45">
                    {c.email} ·{" "}
                    <a href={wa} target="_blank" rel="noreferrer" className="text-wine">
                      {c.phone}
                    </a>
                    {c.city ? ` · ${c.city}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3">{c.orderCount}</td>
                <td className="px-4 py-3">{formatPrice(c.totalSpent)}</td>
                <td className="px-4 py-3">
                  <Input
                    className="min-w-[160px]"
                    defaultValue={c.tags.join(", ")}
                    placeholder="VIP, wholesale"
                    onChange={(e) =>
                      setTagDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))
                    }
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="text-wine"
                    onClick={() => saveTags(c.id)}
                  >
                    Save tags
                  </button>
                </td>
              </tr>
            );
          })}
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
