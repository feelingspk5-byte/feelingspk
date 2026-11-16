import Image from "next/image";
import Link from "next/link";
import { FabricPlaceholder } from "@/components/ui/fabric-placeholder";
import type { Collection } from "@/lib/types";

export function CollectionTile({
  collection,
  shades = [],
}: {
  collection: Collection;
  shades?: { name: string; hex: string }[];
}) {
  return (
    <Link
      href={`/products/${collection.slug}`}
      prefetch
      className="group flex h-full flex-col overflow-hidden bg-ivory transition-transform duration-feel hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-stone/25">
        {collection.imageSrc ? (
          <Image
            src={collection.imageSrc}
            alt=""
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <FabricPlaceholder
            aspect="portrait"
            label="Collection image pending"
            className="rounded-none border-0"
          />
        )}
      </div>

      <div className="flex min-h-[9.5rem] flex-1 flex-col border-t border-ink/10 bg-ivory px-5 py-5 md:min-h-[10.25rem] md:px-6 md:py-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink/45">
          Fabric line
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight text-ink md:text-[1.75rem]">
          {collection.name}
        </h3>
        {collection.description ? (
          <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-ink/65">
            {collection.description}
          </p>
        ) : (
          <div className="mt-2 min-h-[2.75rem]" aria-hidden />
        )}
        <span className="mt-auto inline-flex pt-4 text-[11px] uppercase tracking-[0.18em] text-wine transition-transform duration-feel group-hover:translate-x-1">
          Explore line →
        </span>
      </div>

      {shades.length > 0 ? (
        <div className="flex w-full border-t border-ink/10">
          {shades.map((shade) => (
            <span
              key={shade.name}
              title={shade.name}
              className="h-3 min-w-0 flex-1 border-r border-ivory/40 last:border-r-0"
              style={{ backgroundColor: shade.hex }}
              aria-label={shade.name}
            />
          ))}
        </div>
      ) : null}
    </Link>
  );
}
