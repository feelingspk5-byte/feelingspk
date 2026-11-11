"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Order, ReturnRequest, ReturnStatus } from "@/lib/store/types";

const STATUSES: ReturnStatus[] = [
  "requested",
  "approved",
  "received",
  "refunded",
  "rejected",
];

export function ReturnsManager({
  initial,
  orders,
}: {
  initial: ReturnRequest[];
  orders: Order[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [orderId, setOrderId] = useState(orders[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  async function create(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, reason, notes }),
    });
    const data = (await res.json()) as { return?: ReturnRequest };
    if (data.return) {
      setItems((prev) => [data.return!, ...prev]);
      setReason("");
      setNotes("");
      router.refresh();
    }
  }

  async function setStatus(id: string, status: ReturnStatus) {
    await fetch("/api/admin/returns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={create} className="space-y-4 border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">Log return / exchange</h2>
        <select
          className="h-11 w-full rounded-sm border border-ink/15 bg-stone/40 px-3 text-sm"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        >
          {orders.length === 0 ? (
            <option value="">No orders yet</option>
          ) : (
            orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} — {o.customer.name}
              </option>
            ))
          )}
        </select>
        <Input
          required
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Textarea
          rows={2}
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button type="submit" disabled={!orderId}>
          Create return
        </Button>
      </form>

      <ul className="divide-y divide-ink/10 border border-ink/10 bg-ivory">
        {items.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="font-medium">
                {r.customerName} · {r.orderId}
              </p>
              <p className="text-xs text-ink/50">
                {r.reason} · {r.status}
              </p>
            </div>
            <select
              className="h-10 rounded-sm border border-ink/15 bg-stone/40 px-2 text-sm"
              value={r.status}
              onChange={(e) =>
                setStatus(r.id, e.target.value as ReturnStatus)
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="px-5 py-8 text-sm text-ink/55">No returns logged.</li>
        ) : null}
      </ul>
    </div>
  );
}
