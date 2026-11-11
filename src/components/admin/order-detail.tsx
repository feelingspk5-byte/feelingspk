"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CallClientActions } from "@/components/admin/call-client-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { pushRecent } from "@/lib/admin-recent";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/store/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "packing",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderDetail({ order: initial }: { order: Order }) {
  const router = useRouter();
  const [order, setOrder] = useState(initial);
  const [status, setStatus] = useState(initial.status);
  const [tracking, setTracking] = useState(initial.tracking ?? "");
  const [notes, setNotes] = useState(initial.internalNotes ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    pushRecent({
      id: initial.id,
      type: "order",
      title: `${initial.customer.name} · ${initial.id}`,
      subtitle: initial.status,
      href: `/admin/orders/${initial.id}`,
    });
  }, [initial.id, initial.customer.name, initial.status]);

  async function save() {
    setBusy(true);
    setMessage(null);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        tracking: tracking || undefined,
        internalNotes: notes || undefined,
      }),
    });
    const data = (await res.json()) as { order?: Order; error?: string };
    setBusy(false);
    if (!res.ok || !data.order) {
      setMessage(data.error ?? "Could not update order.");
      return;
    }
    setOrder(data.order);
    setMessage("Saved.");
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section className="rounded-sm border border-ink/10 bg-ivory p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="font-display text-2xl">Customer</h2>
            <CallClientActions
              phone={order.customer.phone}
              name={order.customer.name}
              compact
            />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Name</dt>
              <dd>{order.customer.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Email</dt>
              <dd>{order.customer.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Phone</dt>
              <dd className="font-medium">{order.customer.phone}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-sm border border-ink/10 bg-ivory p-6">
          <h2 className="font-display text-2xl">Delivery</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/80">
            {order.delivery.address}
            <br />
            {order.delivery.city}
            {order.delivery.postal ? ` · ${order.delivery.postal}` : ""}
          </p>
          {order.delivery.notes ? (
            <p className="mt-3 text-sm text-ink/55">{order.delivery.notes}</p>
          ) : null}
        </section>

        <section className="rounded-sm border border-ink/10 bg-ivory p-6">
          <h2 className="font-display text-2xl">Items</h2>
          <ul className="mt-4 divide-y divide-ink/10">
            {order.lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{line.productName}</p>
                  <p className="text-xs text-ink/50">
                    Qty {line.quantity}
                    {line.colourName ? ` · ${line.colourName}` : ""}
                    {line.cutLabel ? ` · ${line.cutLabel}` : ""}
                    {line.sizeLabel ? ` · ${line.sizeLabel}` : ""}
                  </p>
                </div>
                <p>
                  {line.unitPrice === undefined
                    ? "—"
                    : formatPrice(line.unitPrice * line.quantity, line.currency)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-sm border border-ink/10 bg-[#f3eee4] p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-wine">
          Cash on Delivery
        </p>
        <p className="font-display text-2xl">
          {order.subtotal === undefined
            ? "—"
            : formatPrice(order.subtotal, order.currency)}
        </p>
        <CallClientActions
          phone={order.customer.phone}
          name={order.customer.name}
        />

        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Status
          </span>
          <select
            className="flex h-11 w-full rounded-sm border border-ink/15 bg-ivory px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Tracking
          </span>
          <Input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="Courier / tracking no."
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Internal notes
          </span>
          <Textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        {message ? <p className="text-sm text-ink/60">{message}</p> : null}

        <Button onClick={save} disabled={busy} className="w-full">
          {busy ? "Saving…" : "Update order"}
        </Button>
        <a
          href={`/admin/orders/${order.id}/print`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 w-full items-center justify-center rounded-sm border border-ink text-sm transition-colors hover:bg-ink hover:text-ivory"
        >
          Print invoice / packing slip
        </a>
      </aside>
    </div>
  );
}
