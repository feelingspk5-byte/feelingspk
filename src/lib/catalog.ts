import "server-only";

import { ensureStore, readStore } from "@/lib/store/file-store";
import type { Collection, FabricProduct } from "@/lib/types";

export { availabilityLabel, formatPrice } from "@/lib/format";

/** Prefer this in async server pages so prices never race ahead of Supabase. */
export async function loadCatalog() {
  await ensureStore();
  return readStore();
}

export function getSiteConfig() {
  return readStore().siteConfig;
}

export function getCollections(): Collection[] {
  return [...readStore().collections].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return readStore().collections.find((c) => c.slug === slug);
}

function isPublished(p: FabricProduct) {
  return (p.publishStatus ?? "published") === "published";
}

export function getProducts(): FabricProduct[] {
  return readStore().products.filter(isPublished);
}

export function getAllProductsAdmin(): FabricProduct[] {
  return [...readStore().products];
}

export function getProductBySlug(slug: string): FabricProduct | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): FabricProduct | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getProductsByCollection(slug: string): FabricProduct[] {
  return getProducts().filter((p) => p.collectionSlugs.includes(slug));
}

export function getNewArrivals(): FabricProduct[] {
  return getProducts().filter((p) => p.newArrival);
}

export function getFeaturedProducts(): FabricProduct[] {
  return getProducts().filter((p) => p.featured);
}

export function getBestSellers(): FabricProduct[] {
  return getProducts().filter((p) => p.bestSeller);
}

export function searchProducts(query: string): FabricProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return getProducts();
  return getProducts().filter((p) => {
    const colours = (p.colourVariants ?? []).map((c) => c.name).join(" ");
    const hay = [p.name, p.sku, p.fabricType, p.description, colours]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getCms() {
  return readStore().cms;
}

export function getOffers() {
  return readStore().offers;
}

export function getShippingZones() {
  return readStore().shippingZones;
}

export function getCustomers() {
  return readStore().customers;
}

export function getReturns() {
  return readStore().returns;
}

export function getAuditLog() {
  return readStore().auditLog;
}
