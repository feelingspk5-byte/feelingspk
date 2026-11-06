/** FEELINGS catalogue types — fabric only, never ready-made garments. */

export type SellingMethod =
  | "fixed_cut"
  | "per_metre"
  | "per_yard"
  | "fixed_price"
  | "unconfirmed";

export type Availability = "in_stock" | "out_of_stock" | "unconfirmed";

export type FabricImageKind = "hero" | "texture" | "colour" | "packaging";

export interface FabricImage {
  id: string;
  /** Empty until owner uploads assets */
  src: string;
  alt: string;
  kind: FabricImageKind;
}

export interface ColourVariant {
  id: string;
  name: string;
  imageIds?: string[];
  available?: boolean;
}

export interface CutOption {
  id: string;
  label: string;
  quantity: number;
  unit: string;
  price?: number;
}

export interface FabricProduct {
  id: string;
  slug: string;
  name: string;
  sku?: string;
  description?: string;
  /** Omit until FEELINGS supplies price */
  price?: number;
  currency?: string;
  collectionSlugs: string[];
  fabricType?: string;
  composition?: string;
  weave?: string;
  finish?: string;
  season?: string;
  care?: string;
  width?: string;
  sellingMethod: SellingMethod;
  cutOptions?: CutOption[];
  colourVariants?: ColourVariant[];
  images: FabricImage[];
  availability: Availability;
  featured?: boolean;
  newArrival?: boolean;
  /** Only set when client confirms sales data or featured status */
  bestSeller?: boolean;
  includesNote?: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description?: string;
  /** Empty until owner provides collection imagery */
  imageSrc?: string;
  sortOrder?: number;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  announcement: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsapp: string | null;
  social: {
    instagram?: string | null;
    facebook?: string | null;
  };
  currencyPlaceholder: string;
  paymentMethods: string[];
  shippingConnected: boolean;
  checkoutConnected: boolean;
}

export interface CartLine {
  key: string;
  productId: string;
  productSlug: string;
  productName: string;
  colourVariantId?: string;
  colourName?: string;
  cutOptionId?: string;
  cutLabel?: string;
  quantity: number;
  unitLabel?: string;
  unitPrice?: number;
  currency?: string;
  imageSrc?: string;
}
