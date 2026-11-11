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
  paymentMethod: string;
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
  discountAmount?: number;
  shippingAmount?: number;
  currency: string;
  couponCode?: string;
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

export type OfferType =
  | "percent"
  | "fixed"
  | "free_shipping"
  | "sale_badge";

export interface Offer {
  id: string;
  name: string;
  type: OfferType;
  /** percent 1-100 or fixed PKR amount */
  value: number;
  code?: string;
  badgeText?: string;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  minOrder?: number;
  usageLimit?: number;
  usedCount: number;
  collectionSlugs?: string[];
  productIds?: string[];
  createdAt: string;
}

export interface HeroSlide {
  src: string;
  alt: string;
  label: string;
  position?: string;
}

export interface CmsContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    slides: HeroSlide[];
  };
  about: {
    title: string;
    body: string;
  };
  contact: {
    title: string;
    body: string;
  };
  faq: { question: string; answer: string }[];
  footerNote: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  cities: string[];
  rate: number;
  freeAbove?: number;
  active: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  tags: string[];
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  lastOrderAt?: string;
}

export type ReturnStatus =
  | "requested"
  | "approved"
  | "received"
  | "refunded"
  | "rejected";

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  reason: string;
  status: ReturnStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail?: string;
}

export interface StoreState {
  version: 2;
  seededAt: string;
  updatedAt: string;
  admin: AdminMeta;
  siteConfig: SiteConfig;
  collections: Collection[];
  products: Product[];
  media: MediaAsset[];
  orders: Order[];
  offers: Offer[];
  cms: CmsContent;
  shippingZones: ShippingZone[];
  customers: CustomerRecord[];
  returns: ReturnRequest[];
  auditLog: AuditEntry[];
}

export type LegacyStoreState = Omit<
  StoreState,
  | "version"
  | "offers"
  | "cms"
  | "shippingZones"
  | "customers"
  | "returns"
  | "auditLog"
> & { version: 1 };
