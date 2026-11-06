import type { Collection, FabricProduct, SiteConfig } from "@/lib/types";

/**
 * FEELINGS catalogue source of truth (temporary structured store).
 *
 * Until the owner supplies fabric PDFs, images, names, prices and policies:
 * - Keep `products` and `collections` empty.
 * - Do not invent categories, prices, fabric claims or reviews.
 *
 * Later: map each uploaded asset/SKU into these arrays (or replace this
 * module with Shopify / another commerce backend).
 */
export const siteConfig: SiteConfig = {
  brandName: "FEELINGS",
  tagline: "Men's unstitched shalwar kameez fabric",
  announcement: null,
  contactEmail: null,
  contactPhone: null,
  whatsapp: null,
  social: {
    instagram: null,
    facebook: null,
  },
  currencyPlaceholder: "PKR",
  paymentMethods: [],
  shippingConnected: false,
  checkoutConnected: false,
};

/** Confirmed FEELINGS collections only — empty until catalogue arrives */
export const collections: Collection[] = [];

/** Confirmed FEELINGS fabric products only — empty until catalogue arrives */
export const products: FabricProduct[] = [];

/**
 * Example shape for when the owner uploads catalogue data.
 * Not exported into the live shop — documentation only.
 */
export const PRODUCT_DATA_SHAPE_EXAMPLE = {
  id: "sku-example",
  slug: "example-fabric-slug",
  name: "Product name from catalogue",
  sku: "SKU-001",
  description: "Factual description supplied by FEELINGS",
  price: undefined,
  currency: "PKR",
  collectionSlugs: ["confirmed-collection-slug"],
  fabricType: undefined,
  composition: undefined,
  weave: undefined,
  finish: undefined,
  season: undefined,
  care: undefined,
  width: undefined,
  sellingMethod: "unconfirmed",
  cutOptions: [],
  colourVariants: [],
  images: [],
  availability: "unconfirmed",
  featured: false,
  newArrival: false,
  bestSeller: false,
  includesNote: undefined,
} as const;
