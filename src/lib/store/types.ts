import type {
  Collection,
  Product,
  ProductImage,
  SiteConfig,
} from "@/lib/types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderLine {
  key: string;
  productId: string;
  productSlug: string;
  productName: string;
  colourName?: string;
  cutLabel?: string;
  sizeLabel?: string;
  quantity: number;
  unitPrice?: number;
  currency?: string;
  imageSrc?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentMethod: "Cash on Delivery";
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    address: string;
    city: string;
    postal?: string;
    notes?: string;
  };
  lines: OrderLine[];
  subtotal?: number;
  currency: string;
  internalNotes?: string;
  tracking?: string;
}

export interface MediaAsset {
  id: string;
  src: string;
  alt: string;
  createdAt: string;
  kind?: ProductImage["kind"];
}

export interface AdminMeta {
  passwordHash: string | null;
  createdAt: string | null;
}

export interface StoreState {
  version: 1;
  seededAt: string;
  updatedAt: string;
  admin: AdminMeta;
  siteConfig: SiteConfig;
  collections: Collection[];
  products: Product[];
  media: MediaAsset[];
  orders: Order[];
}
