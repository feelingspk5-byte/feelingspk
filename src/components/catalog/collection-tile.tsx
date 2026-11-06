import Link from "next/link";
import { FabricPlaceholder } from "@/components/ui/fabric-placeholder";
import type { Collection } from "@/lib/types";

export function CollectionTile({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group block overflow-hidden rounded-sm bg-ivory transition-colors duration-feel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      {collection.imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={collection.imageSrc}
          alt=""
          className="aspect-[4/5] w-full object-cover transition-transform duration-feel group-hover:scale-[1.02]"
        />
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
