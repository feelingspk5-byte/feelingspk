import Image from "next/image";
import Link from "next/link";
import { FabricPlaceholder } from "@/components/ui/fabric-placeholder";
import { availabilityLabel, formatPrice } from "@/lib/format";
import { getActiveOffers } from "@/lib/store/commerce";
import type { FabricProduct } from "@/lib/types";

export function ProductCard({ product }: { product: FabricProduct }) {
  const image = product.images[0];
  const colourCount = product.colourVariants?.length ?? 0;
  const badge = getActiveOffers().find(
    (o) =>
      o.badgeText &&
      (o.type === "sale_badge" ||
        o.type === "percent" ||
        o.type === "fixed") &&
      (!o.productIds?.length || o.productIds.includes(product.id)) &&
      (!o.collectionSlugs?.length ||
        o.collectionSlugs.some((s) => product.collectionSlugs.includes(s))),
  )?.badgeText;

  return (
    <Link
      href={`/products/${product.slug}`}
      prefetch
      className="group block rounded-sm bg-ivory p-3 transition-colors duration-feel hover:bg-ivory/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      {image?.src ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-stone/40">
          <Image
            src={image.src}
            alt={image.alt || `${product.name} fabric`}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-feel group-hover:scale-[1.02]"
          />
          {badge ? (
            <span className="absolute left-2 top-2 rounded-sm bg-ink px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-ivory">
              {badge}
            </span>
          ) : null}
        </div>
      ) : (
        <FabricPlaceholder label="Fabric photo pending" />
      )}

      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium tracking-wide text-ink group-hover:text-wine">
          {product.name}
        </h3>
        {product.fabricType ? (
          <p className="text-xs text-ink/60">{product.fabricType}</p>
        ) : (
          <p className="text-xs text-ink/45">Fabric details pending</p>
        )}
        <div className="flex items-baseline justify-between gap-2 pt-1">
          <p className="text-sm text-ink">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-ink/50">
            {availabilityLabel(product.availability)}
          </p>
        </div>
        {colourCount > 0 ? (
          <p className="text-xs text-ink/55">
            {colourCount} colour{colourCount === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
