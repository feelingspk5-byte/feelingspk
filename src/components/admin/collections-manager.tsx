"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Collection } from "@/lib/types";

export function CollectionsManager({
  initial,
}: {
  initial: Collection[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, imageSrc }),
    });
    const data = (await res.json()) as {
      error?: string;
      collection?: Collection;
    };
    setBusy(false);
    if (!res.ok || !data.collection) {
      setError(data.error ?? "Could not create collection.");
      return;
    }
    setItems((prev) => [...prev, data.collection!]);
    setName("");
    setDescription("");
    setImageSrc("");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this collection?")) return;
    await fetch(`/api/admin/collections?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setItems((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={create}
        className="space-y-4 border border-ink/10 bg-ivory p-6"
      >
        <h2 className="font-display text-2xl">Add collection</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm md:col-span-2">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
              Name
            </span>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
              Description
            </span>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
              Image path
            </span>
            <Input
              placeholder="/catalogue/… or /uploads/…"
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
            />
          </label>
        </div>
        {error ? <p className="text-sm text-wine">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Create collection"}
        </Button>
      </form>

      <ul className="divide-y divide-ink/10 border border-ink/10 bg-ivory">
        {items
          .slice()
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-start justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-medium text-ink">{c.name}</p>
                <p className="mt-1 text-xs text-ink/45">/{c.slug}</p>
                {c.description ? (
                  <p className="mt-2 max-w-xl text-sm text-ink/60">
                    {c.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => remove(c.id)}
                className="text-sm text-wine"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
