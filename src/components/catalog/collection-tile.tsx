import Image from "next/image";
import Link from "next/link";
import { FabricPlaceholder } from "@/components/ui/fabric-placeholder";
import type { Collection } from "@/lib/types";

export function CollectionTile({
  collection,
  index,
  shades = [],
}: {
  collection: Collection;
  index?: number;
  shades?: { name: string; hex: string }[];
}) {
  const number =
    typeof index === "number" ? String(index + 1).padStart(2, "0") : null;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      prefetch
      className="group flex h-full flex-col overflow-hidden bg-ivory transition-transform duration-feel hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone/30">
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
        {/* Soft fade only — fabric stays visible, no solid grey slab */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/50 to-transparent" />

        {number ? (
          <span className="absolute left-4 top-4 z-10 text-[11px] uppercase tracking-[0.22em] text-ivory drop-shadow-sm">
            {number}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ivory/85 drop-shadow-sm">
            Fabric line
          </p>
          <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight text-ivory drop-shadow-sm md:text-[1.75rem]">
            {collection.name}
          </h3>
          {collection.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ivory/90 drop-shadow-sm">
              {collection.description}
            </p>
          ) : null}
          <span className="mt-4 inline-flex text-[11px] uppercase tracking-[0.18em] text-ivory drop-shadow-sm transition-transform duration-feel group-hover:translate-x-1">
            Explore line →
          </span>
        </div>
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
