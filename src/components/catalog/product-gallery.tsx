"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FabricPlaceholder } from "@/components/ui/fabric-placeholder";
import { cn } from "@/lib/cn";
import type { FabricImage } from "@/lib/types";

export function ProductGallery({
  images,
  productName,
}: {
  images: FabricImage[];
  productName: string;
}) {
  // Dedupe identical srcs so colour switches stay light
  const usable = images.filter(
    (img, index, arr) =>
      Boolean(img.src) && arr.findIndex((x) => x.src === img.src) === index,
  );
  const [active, setActive] = useState(0);
  const current = usable[active] ?? usable[0];

  useEffect(() => {
    setActive(0);
  }, [usable[0]?.id]);

  // Warm remaining thumbs in the background
  useEffect(() => {
    usable.slice(1).forEach((img) => {
      const el = new window.Image();
      el.src = img.src;
    });
  }, [usable]);

  if (usable.length === 0) {
    return (
      <div className="space-y-3">
        <FabricPlaceholder
          aspect="square"
          label={`${productName} — fabric photography pending`}
        />
        <p className="text-sm text-ink/60">
          Full view, texture close-up and colour-accurate shots will be added
          when FEELINGS uploads product images.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-ivory">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || `${productName} fabric`}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {usable.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {usable.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm border",
                active === index ? "border-wine" : "border-transparent",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
