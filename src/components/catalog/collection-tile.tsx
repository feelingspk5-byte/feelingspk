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
      className="group relative flex flex-col overflow-hidden bg-ivory transition-transform duration-feel hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone/40">
        {collection.imageSrc ? (
          <Image
            src={collection.imageSrc}
            alt=""
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <FabricPlaceholder
            aspect="portrait"
            label="Collection image pending"
            className="rounded-none border-0"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent opacity-80 transition-opacity duration-feel group-hover:opacity-95" />

        {number ? (
          <span className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.22em] text-ivory/85">
            {number}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ivory/70">
            Fabric line
          </p>
          <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight text-ivory md:text-[1.75rem]">
            {collection.name}
          </h3>
          {collection.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ivory/75">
              {collection.description}
            </p>
          ) : null}
          <span className="mt-4 inline-flex text-[11px] uppercase tracking-[0.18em] text-ivory transition-transform duration-feel group-hover:translate-x-1">
            Explore line →
          </span>
        </div>
      </div>

      {shades.length > 0 ? (
        <div className="flex border-t border-ink/10">
          {shades.map((shade) => (
            <span
              key={shade.name}
              title={shade.name}
              className="h-3 flex-1 border-r border-ivory/30 last:border-r-0"
              style={{ backgroundColor: shade.hex }}
              aria-label={shade.name}
            />
          ))}
        </div>
      ) : null}
    </Link>
  );
}
