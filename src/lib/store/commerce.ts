import { readStore } from "@/lib/store/file-store";
import {
  applyCatalogueDiscount,
  offerAppliesToProduct,
  pickCatalogueDiscount,
  type CatalogueDiscount,
  type ProductRef,
  type SalePricing,
} from "@/lib/store/sale-pricing";
import type { Offer, ShippingZone } from "@/lib/store/types";

export type {
  CatalogueDiscount,
  ProductRef,
  SalePricing,
} from "@/lib/store/sale-pricing";
export {
  applyCatalogueDiscount,
  offerAppliesToProduct,
} from "@/lib/store/sale-pricing";

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

/**
 * Best automatic catalogue discount for a product.
 * Coupon-coded offers stay checkout-only; leave code blank in admin for shop sale prices.
 */
export function getCatalogueDiscount(
  product: ProductRef,
  offers = getActiveOffers(),
): CatalogueDiscount | null {
  return pickCatalogueDiscount(product, offers, calcDiscount);
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
