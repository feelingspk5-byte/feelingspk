"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Offer, OfferType } from "@/lib/store/types";

export function OffersManager({ initial }: { initial: Offer[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [type, setType] = useState<OfferType>("percent");
  const [value, setValue] = useState("10");
  const [code, setCode] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type,
        value: Number(value) || 0,
        code: code || undefined,
        badgeText: badgeText || undefined,
        minOrder: minOrder ? Number(minOrder) : undefined,
        active: true,
      }),
    });
    const data = (await res.json()) as { error?: string; offer?: Offer };
    setBusy(false);
    if (!res.ok || !data.offer) {
      setError(data.error ?? "Could not create offer.");
      return;
    }
    setItems((prev) => [data.offer!, ...prev]);
    setName("");
    setCode("");
    setBadgeText("");
    setMinOrder("");
    router.refresh();
  }

  async function toggle(offer: Offer) {
    const next = { ...offer, active: !offer.active };
    await fetch("/api/admin/offers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setItems((prev) => prev.map((o) => (o.id === offer.id ? next : o)));
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/admin/offers?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setItems((prev) => prev.filter((o) => o.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={create} className="space-y-4 border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">Create offer</h2>
        <p className="text-sm text-ink/60">
          For sale prices on the shop (strikethrough old price + Save %), use
          Percent or Fixed and leave the coupon code blank. Add a code only for
          checkout coupons.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Input required placeholder="Name (Eid Sale)" value={name} onChange={(e) => setName(e.target.value)} />
          <select
            className="h-11 rounded-sm border border-ink/15 bg-stone/40 px-3 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as OfferType)}
          >
            <option value="percent">Percent off</option>
            <option value="fixed">Fixed amount off</option>
            <option value="free_shipping">Free shipping</option>
            <option value="sale_badge">Sale badge only</option>
          </select>
          <Input type="number" placeholder="Value (% or PKR)" value={value} onChange={(e) => setValue(e.target.value)} />
          <Input placeholder="Coupon code (blank = auto sale price)" value={code} onChange={(e) => setCode(e.target.value)} />
          <Input placeholder="Badge text (Sale)" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} />
          <Input type="number" placeholder="Min order PKR (optional)" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
        </div>
        {error ? <p className="text-sm text-wine">{error}</p> : null}
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Create offer"}</Button>
      </form>

      <ul className="divide-y divide-ink/10 border border-ink/10 bg-ivory">
        {items.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="font-medium">{o.name}</p>
              <p className="text-xs text-ink/50">
                {o.type} · {o.value}
                {o.code ? ` · code ${o.code}` : ""}
                {o.badgeText ? ` · badge “${o.badgeText}”` : ""}
                {" · "}
                {o.active ? "active" : "paused"} · used {o.usedCount}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button type="button" onClick={() => toggle(o)} className="text-ink hover:text-wine">
                {o.active ? "Pause" : "Activate"}
              </button>
              <button type="button" onClick={() => remove(o.id)} className="text-wine">
                Delete
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="px-5 py-8 text-sm text-ink/55">No offers yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
