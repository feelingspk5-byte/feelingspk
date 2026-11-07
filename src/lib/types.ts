/** FEELINGS catalogue types — elite men's collection. */

export type ProductCategory =
  | "unstitched_fabric"
  | "stitched_shalwar_kameez"
  | "dress_shirt";

export type SellingMethod =
  | "fixed_cut"
  | "per_metre"
  | "per_yard"
  | "fixed_price"
  | "unconfirmed";

export type Availability = "in_stock" | "out_of_stock" | "unconfirmed";

export type ProductImageKind =
  | "hero"
  | "texture"
  | "colour"
  | "packaging"
  | "flat"
  | "on_form";

export interface ProductImage {
  id: string;
  /** Empty until owner uploads assets */
  src: string;
  alt: string;
  kind: ProductImageKind;
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

/** Garment size options for stitched shalwar kameez and dress shirts */
export interface SizeOption {
  id: string;
  label: string;
  available?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
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
  /** Fabric quantity / cut options */
  cutOptions?: CutOption[];
  /** Stitched garment / shirt sizes */
  sizeOptions?: SizeOption[];
  colourVariants?: ColourVariant[];
  images: ProductImage[];
  availability: Availability;
  featured?: boolean;
  newArrival?: boolean;
  /** Only set when client confirms sales data or featured status */
  bestSeller?: boolean;
  includesNote?: string;
}

/** @deprecated Use Product — kept as alias during migration */
export type FabricProduct = Product;
export type FabricImage = ProductImage;

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category?: ProductCategory | "mixed";
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
  category?: ProductCategory;
  colourVariantId?: string;
  colourName?: string;
  cutOptionId?: string;
  cutLabel?: string;
  sizeOptionId?: string;
  sizeLabel?: string;
  quantity: number;
  unitLabel?: string;
  unitPrice?: number;
  currency?: string;
  imageSrc?: string;
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  unstitched_fabric: "Unstitched Fabric",
  stitched_shalwar_kameez: "Stitched Shalwar Kameez",
  dress_shirt: "Dress Shirts",
};

export const DEFAULT_SHALWAR_KAMEEZ_SIZES: SizeOption[] = [
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "XXL" },
];

export const DEFAULT_DRESS_SHIRT_SIZES: SizeOption[] = [
  { id: "14.5", label: "14.5" },
  { id: "15", label: "15" },
  { id: "15.5", label: "15.5" },
  { id: "16", label: "16" },
  { id: "16.5", label: "16.5" },
  { id: "17", label: "17" },
  { id: "17.5", label: "17.5" },
];
