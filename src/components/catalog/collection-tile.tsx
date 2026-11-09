import Image from "next/image";
import Link from "next/link";
import { FabricPlaceholder } from "@/components/ui/fabric-placeholder";
import type { Collection } from "@/lib/types";

export function CollectionTile({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      prefetch
      className="group block overflow-hidden rounded-sm bg-ivory transition-colors duration-feel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      {collection.imageSrc ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone/40">
          <Image
            src={collection.imageSrc}
            alt=""
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-feel group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <FabricPlaceholder
          aspect="portrait"
          label="Collection image pending"
          className="rounded-none border-0"
        />
      )}
      <div className="border-t border-ink/10 px-4 py-4">
        <h3 className="font-display text-xl text-ink group-hover:text-wine">
          {collection.name}
        </h3>
        {collection.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-ink/65">
            {collection.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
