import type { Collection, Product, SiteConfig } from "@/lib/types";

/**
 * FEELINGS catalogue source of truth (temporary structured store).
 *
 * Categories:
 * - Unstitched fabric
 * - Stitched shalwar kameez (size-based)
 * - Dress shirts (size-based)
 *
 * Keep arrays empty until the owner supplies real products.
 * Demo homepage imagery lives separately in `demo-home.ts`.
 */
export const siteConfig: SiteConfig = {
  brandName: "FEELINGS",
  tagline: "Elite Men's Collection",
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

/** Confirmed FEELINGS products only — empty until catalogue arrives */
export const products: Product[] = [];

/**
 * Example shapes for later catalogue upload — not live inventory.
 */
export const PRODUCT_DATA_SHAPE_EXAMPLES = {
  unstitched_fabric: {
    category: "unstitched_fabric",
    sellingMethod: "unconfirmed",
    cutOptions: [],
    sizeOptions: undefined,
  },
  stitched_shalwar_kameez: {
    category: "stitched_shalwar_kameez",
    sellingMethod: "fixed_price",
    sizeOptions: [
      { id: "s", label: "S" },
      { id: "m", label: "M" },
      { id: "l", label: "L" },
      { id: "xl", label: "XL" },
      { id: "xxl", label: "XXL" },
    ],
  },
  dress_shirt: {
    category: "dress_shirt",
    sellingMethod: "fixed_price",
    sizeOptions: [
      { id: "15", label: "15" },
      { id: "15.5", label: "15.5" },
      { id: "16", label: "16" },
      { id: "16.5", label: "16.5" },
      { id: "17", label: "17" },
    ],
  },
} as const;
