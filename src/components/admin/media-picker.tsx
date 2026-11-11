"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { MediaAsset } from "@/lib/store/types";

export function MediaPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (src: string, alt: string) => void;
}) {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    void fetch("/api/admin/media")
      .then((r) => r.json())
      .then((data: { media?: MediaAsset[] }) => {
        setMedia(data.media ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-3xl overflow-hidden border border-ink/15 bg-ivory"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-wine">
              Media library
            </p>
            <h2 className="font-display text-2xl">Pick an image</h2>
          </div>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-ink/55">Loading…</p>
          ) : media.length === 0 ? (
            <p className="text-sm text-ink/55">
              No media yet. Upload files under Media first.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {media.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="overflow-hidden border border-ink/10 text-left hover:border-wine"
                  onClick={() => {
                    onPick(m.src, m.alt);
                    onClose();
                  }}
                >
                  <div className="relative aspect-[3/4] bg-stone">
                    <Image
                      src={m.src}
                      alt={m.alt}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <p className="truncate px-2 py-1.5 text-[11px] text-ink/55">
                    {m.src}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
