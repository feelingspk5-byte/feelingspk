import { collections, products, siteConfig } from "@/data/catalog";
import { defaultCms, defaultShippingZones } from "@/lib/store/defaults";
import type { MediaAsset, StoreState } from "@/lib/store/types";

function collectMedia(): MediaAsset[] {
  const seen = new Set<string>();
  const media: MediaAsset[] = [];
  const now = new Date().toISOString();

  for (const product of products) {
    for (const image of product.images) {
      if (!image.src || seen.has(image.src)) continue;
      seen.add(image.src);
      media.push({
        id: image.id,
        src: image.src,
        alt: image.alt,
        kind: image.kind,
        createdAt: now,
      });
    }
  }

  for (const collection of collections) {
    if (!collection.imageSrc || seen.has(collection.imageSrc)) continue;
    seen.add(collection.imageSrc);
    media.push({
      id: `media-${collection.id}`,
      src: collection.imageSrc,
      alt: collection.name,
      kind: "hero",
      createdAt: now,
    });
  }

  return media;
}

export function createSeedStore(): StoreState {
  const now = new Date().toISOString();
  return {
    version: 2,
    seededAt: now,
    updatedAt: now,
    admin: {
      passwordHash: null,
      createdAt: null,
    },
    siteConfig: structuredClone(siteConfig),
    collections: structuredClone(collections),
    products: structuredClone(products),
    media: collectMedia(),
    orders: [],
    offers: [],
    cms: defaultCms(),
    shippingZones: defaultShippingZones(),
    customers: [],
    returns: [],
    auditLog: [],
  };
}
