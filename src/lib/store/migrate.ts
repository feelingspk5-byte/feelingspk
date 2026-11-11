import { defaultCms, defaultShippingZones } from "@/lib/store/defaults";
import type { LegacyStoreState, StoreState } from "@/lib/store/types";

export function migrateStore(raw: unknown): StoreState {
  const data = raw as Partial<StoreState> & { version?: number };

  if (data.version === 2 && data.siteConfig && data.products) {
    return {
      ...(data as StoreState),
      version: 2,
      offers: data.offers ?? [],
      cms: data.cms ?? defaultCms(),
      shippingZones: data.shippingZones ?? defaultShippingZones(),
      customers: data.customers ?? [],
      returns: data.returns ?? [],
      auditLog: data.auditLog ?? [],
    };
  }

  const v1 = data as unknown as LegacyStoreState;
  return {
    version: 2,
    seededAt: v1.seededAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    admin: v1.admin ?? { passwordHash: null, createdAt: null },
    siteConfig: v1.siteConfig,
    collections: v1.collections ?? [],
    products: v1.products ?? [],
    media: v1.media ?? [],
    orders: v1.orders ?? [],
    offers: [],
    cms: defaultCms(),
    shippingZones: defaultShippingZones(),
    customers: [],
    returns: [],
    auditLog: [],
  };
}
