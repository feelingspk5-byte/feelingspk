"use client";

import { useState } from "react";
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
  const usable = images.filter((img) => img.src);
  const [active, setActive] = useState(0);
  const current = usable[active];

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.src}
        alt={current.alt || `${productName} fabric`}
        className="aspect-square w-full rounded-sm object-cover bg-ivory"
      />
      {usable.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {usable.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "overflow-hidden rounded-sm border",
                active === index ? "border-wine" : "border-transparent",
              )}
              aria-label={`View image ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt=""
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
