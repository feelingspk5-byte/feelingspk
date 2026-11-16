import "server-only";

import {
  getCollections,
  getFeaturedProducts,
  getProducts,
  getProductsByCollection,
  getSiteConfig,
} from "@/lib/catalog";
import {
  demoAssurances,
  demoEditorial,
} from "@/data/demo-home";
import { getActiveOffers } from "@/lib/store/commerce";
import {
  PRODUCT_CATEGORY_LABELS,
  type ProductCategory,
} from "@/lib/types";
import type {
  HomeCategoryCard,
  HomeCollectionCard,
  HomeFabricCard,
  LaunchOfferContent,
} from "@/lib/home-types";

export type {
  HomeCategoryCard,
  HomeCollectionCard,
  HomeFabricCard,
  LaunchOfferContent,
} from "@/lib/home-types";

function productHrefForCollection(slug: string) {
  const product = getProductsByCollection(slug)[0];
  return product ? `/products/${product.slug}` : `/shop?collection=${slug}`;
}

function collectionImage(slug: string, fallback?: string) {
  const collection = getCollections().find((c) => c.slug === slug);
  if (collection?.imageSrc) return collection.imageSrc;
  const product = getProductsByCollection(slug)[0];
  return product?.images[0]?.src || fallback || "/brand/editorial-one-house.jpg";
}

const CATEGORY_DETAILS: Record<ProductCategory, string> = {
  unstitched_fabric:
    "Cut lengths and full lines for the tailor’s bench — shade by shade.",
  stitched_shalwar_kameez:
    "Ready silhouettes with considered fabric and everyday presence.",
  dress_shirt: "Crisp shirts that finish the look for formal and daily wear.",
};

/** Dedicated category imagery — never fall back to another category’s photo. */
const CATEGORY_IMAGES: Record<ProductCategory, string> = {
  unstitched_fabric: "/brand/hero/fabric-atelier-right.jpg",
  stitched_shalwar_kameez: "/brand/hero/shalwar-kameez-wide.jpg",
  dress_shirt: "/brand/hero/dress-shirt-formal.jpg",
};

export function getHomeCategories(): HomeCategoryCard[] {
  const products = getProducts();
  const order: ProductCategory[] = [
    "unstitched_fabric",
    "stitched_shalwar_kameez",
    "dress_shirt",
  ];

  return order.map((category) => {
    const match = products.find((p) => p.category === category);
    // Only use a live product photo when that category actually has products.
    // Coming-soon categories keep their own brand images.
    const image = match?.images[0]?.src || CATEGORY_IMAGES[category];
    return {
      slug: category,
      name: PRODUCT_CATEGORY_LABELS[category],
      detail: CATEGORY_DETAILS[category],
      image,
      href: `/shop?category=${category}`,
      badge:
        category === "stitched_shalwar_kameez" || category === "dress_shirt"
          ? match
            ? null
            : "Coming soon"
          : null,
    };
  });
}

export function getHomeCollections(): HomeCollectionCard[] {
  return getCollections().map((collection) => ({
    slug: collection.slug,
    name: collection.name,
    detail:
      collection.description?.trim() ||
      "Open this fabric line to choose a shade.",
    image: collectionImage(collection.slug),
    href: productHrefForCollection(collection.slug),
  }));
}

export function getHomeFabrics(): HomeFabricCard[] {
  const featured = getFeaturedProducts();
  const source = featured.length ? featured : getProducts();
  return source.slice(0, 6).map((product) => ({
    slug: product.slug,
    name: product.name,
    detail:
      product.fabricType ||
      product.description ||
      `${product.colourVariants?.length ?? 0} shades`,
    image: product.images[0]?.src || "/brand/editorial-one-house.jpg",
    tag: product.newArrival ? "New" : product.bestSeller ? "Best seller" : "Fabric",
  }));
}

export function getHomeEditorial() {
  const cmsAbout = getSiteConfig();
  return {
    ...demoEditorial,
    // Keep brand editorial art; pull live brand name into body when useful
    body: demoEditorial.body.replace("FEELINGS", cmsAbout.brandName || "FEELINGS"),
  };
}

export function getHomeAssurances() {
  return demoAssurances;
}

export function getLaunchOfferContent(): LaunchOfferContent {
  const offers = getActiveOffers();
  const percentOffers = offers
    .filter(
      (o) =>
        o.type === "percent" &&
        !o.code?.trim() &&
        o.value > 0 &&
        !o.productIds?.length &&
        !o.collectionSlugs?.length,
    )
    .sort((a, b) => b.value - a.value);
  const scoped = offers
    .filter(
      (o) => o.type === "percent" && !o.code?.trim() && o.value > 0,
    )
    .sort((a, b) => b.value - a.value);

  const best = percentOffers[0] ?? scoped[0];
  if (!best) return null;

  const freeDelivery = offers.some((o) => o.type === "free_shipping");

  return {
    percent: best.value,
    title: `${best.value}% off every article`,
    body:
      best.badgeText?.trim() ||
      `Opening the Elite Men's Collection with ${best.name} — ${best.value}% off, with${freeDelivery ? " free delivery on your first order" : " nationwide Cash on Delivery"}.`,
    freeDelivery,
    shopHref: "/collections",
  };
}

export function getCollectionProductHref(slug: string) {
  return productHrefForCollection(slug);
}
