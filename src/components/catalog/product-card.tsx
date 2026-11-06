import Link from "next/link";
import { FabricPlaceholder } from "@/components/ui/fabric-placeholder";
import { availabilityLabel, formatPrice } from "@/lib/catalog";
import type { FabricProduct } from "@/lib/types";

export function ProductCard({ product }: { product: FabricProduct }) {
  const image = product.images[0];
  const colourCount = product.colourVariants?.length ?? 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-sm bg-ivory p-3 transition-colors duration-feel hover:bg-ivory/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      {image?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt || `${product.name} fabric`}
          className="aspect-[3/4] w-full rounded-sm object-cover"
        />
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
