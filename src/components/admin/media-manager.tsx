"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MediaAsset } from "@/lib/store/types";

export function MediaManager({ initial }: { initial: MediaAsset[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    if (!fileInput.files?.[0]) {
      setError("Choose a file.");
      return;
    }
    setBusy(true);
    setError(null);
    const data = new FormData();
    data.set("file", fileInput.files[0]);
    data.set("alt", alt);
    const res = await fetch("/api/admin/media", { method: "POST", body: data });
    const json = (await res.json()) as { error?: string; media?: MediaAsset };
    setBusy(false);
    if (!res.ok || !json.media) {
      setError(json.error ?? "Upload failed.");
      return;
    }
    setItems((prev) => [json.media!, ...prev]);
    setAlt("");
    form.reset();
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remove this media record?")) return;
    await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setItems((prev) => prev.filter((m) => m.id !== id));
    router.refresh();
  }

  function copyPath(src: string) {
    void navigator.clipboard.writeText(src);
    setCopied(src);
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onUpload}
        className="space-y-4 border border-ink/10 bg-ivory p-6"
      >
        <h2 className="font-display text-2xl">Upload image</h2>
        <Input
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required
        />
        <Input
          placeholder="Alt text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />
        {error ? <p className="text-sm text-wine">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <article
            key={m.id}
            className="overflow-hidden border border-ink/10 bg-ivory"
          >
            <div className="relative aspect-[4/5] bg-stone">
              {m.src ? (
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="space-y-2 p-3">
              <p className="truncate text-xs text-ink/55">{m.src}</p>
              <div className="flex gap-3 text-sm">
                <button
                  type="button"
                  className="text-ink hover:text-wine"
                  onClick={() => copyPath(m.src)}
                >
                  {copied === m.src ? "Copied" : "Copy path"}
                </button>
                <button
                  type="button"
                  className="text-wine"
                  onClick={() => remove(m.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
