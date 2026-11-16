"use client";

import { useMemo, useState } from "react";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductPurchase } from "@/components/catalog/product-purchase";
import { SalePrice } from "@/components/catalog/sale-price";
import { resolveListPrice } from "@/lib/format";
import {
  applyCatalogueDiscount,
  type CatalogueDiscount,
} from "@/lib/store/sale-pricing";
import type { Product } from "@/lib/types";

export function ProductView({
  product,
  initialColourId,
  catalogueDiscount = null,
}: {
  product: Product;
  initialColourId?: string;
  catalogueDiscount?: CatalogueDiscount | null;
}) {
  const colours = product.colourVariants ?? [];
  const fallbackColour =
    colours.find((c) => c.id === initialColourId)?.id ?? colours[0]?.id;

  const [colourId, setColourId] = useState(fallbackColour);

  const images = useMemo(() => {
    const selected = colours.find((c) => c.id === colourId);
    if (!selected?.imageIds?.length) return product.images;
    const mapped = selected.imageIds
      .map((id) => product.images.find((img) => img.id === id))
      .filter(Boolean);
    return mapped.length ? (mapped as typeof product.images) : product.images;
  }, [colourId, colours, product]);

  const listPrice = resolveListPrice(product, product.cutOptions?.[0]);
  const sale = applyCatalogueDiscount(listPrice, catalogueDiscount);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <ProductGallery images={images} productName={product.name} />
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-wine">
          Elite Men&apos;s Collection
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink md:text-5xl">
          {product.name}
        </h1>
        <div className="mt-4 border-b border-ink/10 pb-5">
          <SalePrice
            price={listPrice}
            currency={product.currency}
            sale={sale}
            size="lg"
          />
          {listPrice !== undefined ? (
            <p className="mt-1.5 text-xs text-ink/50">
              Price for 4.5 metres · Cash on Delivery available
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-ink/55">
              WhatsApp us for the current rate on this fabric.
            </p>
          )}
        </div>
        {product.description ? (
          <p className="mt-5 text-sm leading-relaxed text-ink/75">
            {product.description}
          </p>
        ) : null}
        {product.includesNote ? (
          <p className="mt-4 rounded-sm border border-ink/10 bg-ivory px-3 py-2 text-sm text-ink/75">
            {product.includesNote}
          </p>
        ) : null}
        <div className="mt-8">
          <ProductPurchase
            product={product}
            colourId={colourId}
            onColourChange={setColourId}
            catalogueDiscount={catalogueDiscount}
            showPrice={false}
          />
        </div>
      </div>
    </div>
  );
}
