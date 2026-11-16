import type { Offer } from "@/lib/store/types";
import type { Product } from "@/lib/types";

export type ProductRef = Pick<Product, "id" | "collectionSlugs">;

/** Automatic shop discounts (no coupon code) that paint sale prices on products. */
export type CatalogueDiscount = {
  offerId: string;
  type: "percent" | "fixed";
  value: number;
  badgeText: string;
  name: string;
};

export type SalePricing = {
  original: number;
  sale: number;
  discountAmount: number;
  savePercent: number;
  badgeText: string;
  offerId: string;
};

export function offerAppliesToProduct(
  offer: Offer,
  product: ProductRef,
): boolean {
  const byProduct = offer.productIds?.length
    ? offer.productIds.includes(product.id)
    : true;
  const byCollection = offer.collectionSlugs?.length
    ? offer.collectionSlugs.some((slug) =>
        product.collectionSlugs.includes(slug),
      )
    : true;
  return byProduct && byCollection;
}

export function applyCatalogueDiscount(
  original: number | undefined,
  discount: CatalogueDiscount | null | undefined,
): SalePricing | null {
  if (
    original === undefined ||
    !Number.isFinite(original) ||
    original <= 0 ||
    !discount
  ) {
    return null;
  }

  const discountAmount =
    discount.type === "percent"
      ? Math.round((original * discount.value) / 100)
      : Math.min(original, Math.round(discount.value));
  if (discountAmount <= 0) return null;

  const sale = Math.max(0, original - discountAmount);
  const savePercent = Math.min(
    100,
    Math.round((discountAmount / original) * 100),
  );
  if (savePercent <= 0 || sale >= original) return null;

  return {
    original,
    sale,
    discountAmount,
    savePercent,
    badgeText: discount.badgeText,
    offerId: discount.offerId,
  };
}

export function pickCatalogueDiscount(
  product: ProductRef,
  offers: Offer[],
  calcDiscount: (offer: Offer, subtotal: number) => number,
): CatalogueDiscount | null {
  const candidates = offers.filter(
    (o) =>
      (o.type === "percent" || o.type === "fixed") &&
      !o.code?.trim() &&
      o.value > 0 &&
      offerAppliesToProduct(o, product),
  );
  if (!candidates.length) return null;

  const ranked = [...candidates].sort(
    (a, b) => calcDiscount(b, 10_000) - calcDiscount(a, 10_000),
  );
  const best = ranked[0]!;
  if (best.type !== "percent" && best.type !== "fixed") return null;
  return {
    offerId: best.id,
    type: best.type,
    value: best.value,
    badgeText: best.badgeText?.trim() || "Sale",
    name: best.name,
  };
}
