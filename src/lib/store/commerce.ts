import { readStore } from "@/lib/store/file-store";
import type { Offer, ShippingZone } from "@/lib/store/types";
import type { Product } from "@/lib/types";

export function offerIsLive(offer: Offer, now = Date.now()): boolean {
  if (!offer.active) return false;
  if (offer.startsAt && new Date(offer.startsAt).getTime() > now) return false;
  if (offer.endsAt && new Date(offer.endsAt).getTime() < now) return false;
  if (
    offer.usageLimit !== undefined &&
    offer.usedCount >= offer.usageLimit
  ) {
    return false;
  }
  return true;
}

export function getActiveOffers(): Offer[] {
  return readStore().offers.filter((o) => offerIsLive(o));
}

export function findOfferByCode(code: string): Offer | undefined {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;
  return getActiveOffers().find(
    (o) => o.code && o.code.toUpperCase() === normalized,
  );
}

export function calcDiscount(
  offer: Offer,
  subtotal: number,
): number {
  if (offer.minOrder !== undefined && subtotal < offer.minOrder) return 0;
  if (offer.type === "percent") {
    return Math.round((subtotal * offer.value) / 100);
  }
  if (offer.type === "fixed") {
    return Math.min(subtotal, offer.value);
  }
  return 0;
}

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

/**
 * Best automatic catalogue discount for a product.
 * Coupon-coded offers stay checkout-only; leave code blank in admin for shop sale prices.
 */
export function getCatalogueDiscount(
  product: ProductRef,
  offers = getActiveOffers(),
): CatalogueDiscount | null {
  const candidates = offers.filter(
    (o) =>
      (o.type === "percent" || o.type === "fixed") &&
      !o.code?.trim() &&
      o.value > 0 &&
      offerAppliesToProduct(o, product),
  );
  if (!candidates.length) return null;

  // Prefer the offer that removes the most from a reference PKR 10_000 basket.
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

export function resolveProductSale(
  product: ProductRef,
  originalPrice: number | undefined,
  offers = getActiveOffers(),
): SalePricing | null {
  return applyCatalogueDiscount(
    originalPrice,
    getCatalogueDiscount(product, offers),
  );
}

export function getProductSaleBadge(
  product: ProductRef,
  offers = getActiveOffers(),
): string | undefined {
  const catalogue = getCatalogueDiscount(product, offers);
  if (catalogue) return catalogue.badgeText;

  return offers.find(
    (o) =>
      o.badgeText &&
      (o.type === "sale_badge" ||
        o.type === "percent" ||
        o.type === "fixed") &&
      offerAppliesToProduct(o, product),
  )?.badgeText;
}

export function resolveShipping(
  city: string,
  subtotal: number,
): { zone: ShippingZone | null; amount: number } {
  const zones = readStore().shippingZones.filter((z) => z.active);
  const needle = city.trim().toLowerCase();
  const exact = zones.find(
    (z) =>
      !z.cities.includes("*") &&
      z.cities.some((c) => c.toLowerCase() === needle),
  );
  const fallback = zones.find((z) => z.cities.includes("*"));
  const zone = exact ?? fallback ?? null;
  if (!zone) return { zone: null, amount: 0 };
  if (zone.freeAbove !== undefined && subtotal >= zone.freeAbove) {
    return { zone, amount: 0 };
  }
  return { zone, amount: zone.rate };
}
