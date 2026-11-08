import { collections, products, siteConfig } from "@/data/catalog";
import type { Collection, FabricProduct } from "@/lib/types";

export function getSiteConfig() {
  return siteConfig;
}

export function getCollections(): Collection[] {
  return [...collections].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProducts(): FabricProduct[] {
  return [...products];
}

export function getProductBySlug(slug: string): FabricProduct | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(slug: string): FabricProduct[] {
  return products.filter((p) => p.collectionSlugs.includes(slug));
}

export function getNewArrivals(): FabricProduct[] {
  return products.filter((p) => p.newArrival);
}

export function getFeaturedProducts(): FabricProduct[] {
  return products.filter((p) => p.featured);
}

export function getBestSellers(): FabricProduct[] {
  return products.filter((p) => p.bestSeller);
}

export function searchProducts(query: string): FabricProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return getProducts();
  return products.filter((p) => {
    const colours = (p.colourVariants ?? []).map((c) => c.name).join(" ");
    const hay = [p.name, p.sku, p.fabricType, p.description, colours]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function formatPrice(
  price: number | undefined,
  currency = siteConfig.currencyPlaceholder,
): string {
  if (price === undefined || Number.isNaN(price)) {
    return "Price on request";
  }
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString("en-PK")}`;
  }
}

export function availabilityLabel(
  availability: FabricProduct["availability"],
): string {
  switch (availability) {
    case "in_stock":
      return "In stock";
    case "out_of_stock":
      return "Out of stock";
    default:
      return "Availability to be confirmed";
  }
}
