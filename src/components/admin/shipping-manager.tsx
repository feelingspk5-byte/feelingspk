"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ShippingZone } from "@/lib/store/types";

export function ShippingManager({ initial }: { initial: ShippingZone[] }) {
  const router = useRouter();
  const [zones, setZones] = useState(initial);
  const [name, setName] = useState("");
  const [cities, setCities] = useState("");
  const [rate, setRate] = useState("300");
  const [freeAbove, setFreeAbove] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        cities: cities.split(",").map((c) => c.trim()).filter(Boolean),
        rate: Number(rate) || 0,
        freeAbove: freeAbove ? Number(freeAbove) : undefined,
      }),
    });
    const data = (await res.json()) as { zone?: ShippingZone };
    setBusy(false);
    if (data.zone) {
      setZones((prev) => [...prev, data.zone!]);
      setName("");
      setCities("");
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this shipping zone?")) return;
    await fetch(`/api/admin/shipping?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setZones((prev) => prev.filter((z) => z.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={create} className="space-y-4 border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">Add shipping zone</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input required placeholder="Zone name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Cities (comma-separated) or * for all" value={cities} onChange={(e) => setCities(e.target.value)} />
          <Input type="number" placeholder="Rate PKR" value={rate} onChange={(e) => setRate(e.target.value)} />
          <Input type="number" placeholder="Free above PKR (optional)" value={freeAbove} onChange={(e) => setFreeAbove(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Add zone"}</Button>
      </form>

      <ul className="divide-y divide-ink/10 border border-ink/10 bg-ivory">
        {zones.map((z) => (
          <li key={z.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="font-medium">{z.name}</p>
              <p className="text-xs text-ink/50">
                {z.cities.join(", ")} · Rs {z.rate}
                {z.freeAbove ? ` · free above Rs ${z.freeAbove}` : ""}
                {z.active ? "" : " · paused"}
              </p>
            </div>
            <button type="button" className="text-sm text-wine" onClick={() => remove(z.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
