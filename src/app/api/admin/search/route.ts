import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export type AdminSearchHit = {
  id: string;
  type: "product" | "order" | "customer" | "collection" | "offer" | "page";
  title: string;
  subtitle?: string;
  href: string;
};

const PAGES: AdminSearchHit[] = [
  { id: "page-overview", type: "page", title: "Overview", href: "/admin" },
  { id: "page-products", type: "page", title: "Products", href: "/admin/products" },
  {
    id: "page-products-new",
    type: "page",
    title: "Add product",
    href: "/admin/products/new",
  },
  {
    id: "page-collections",
    type: "page",
    title: "Collections",
    href: "/admin/collections",
  },
  { id: "page-media", type: "page", title: "Media", href: "/admin/media" },
  { id: "page-orders", type: "page", title: "Orders", href: "/admin/orders" },
  {
    id: "page-customers",
    type: "page",
    title: "Customers",
    href: "/admin/customers",
  },
  { id: "page-offers", type: "page", title: "Offers", href: "/admin/offers" },
  { id: "page-cms", type: "page", title: "Website / CMS", href: "/admin/cms" },
  {
    id: "page-shipping",
    type: "page",
    title: "Shipping",
    href: "/admin/shipping",
  },
  {
    id: "page-settings",
    type: "page",
    title: "Settings",
    href: "/admin/settings",
  },
  { id: "page-returns", type: "page", title: "Returns", href: "/admin/returns" },
  {
    id: "page-analytics",
    type: "page",
    title: "Analytics",
    href: "/admin/analytics",
  },
  { id: "page-audit", type: "page", title: "Audit log", href: "/admin/audit" },
];

function match(hay: string, q: string) {
  return hay.toLowerCase().includes(q);
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim().toLowerCase() ?? "";
  if (q.length < 1) {
    return NextResponse.json({ hits: PAGES.slice(0, 8) });
  }

  const store = readStore();
  const hits: AdminSearchHit[] = [];

  for (const page of PAGES) {
    if (match(page.title, q)) hits.push(page);
  }

  for (const p of store.products) {
    const colours = (p.colourVariants ?? []).map((c) => c.name).join(" ");
    const hay = [p.name, p.sku, p.slug, p.description, colours]
      .filter(Boolean)
      .join(" ");
    if (match(hay, q)) {
      hits.push({
        id: p.id,
        type: "product",
        title: p.name,
        subtitle: p.sku ?? p.slug,
        href: `/admin/products/${p.id}`,
      });
    }
  }

  for (const c of store.collections) {
    if (match([c.name, c.slug, c.description].filter(Boolean).join(" "), q)) {
      hits.push({
        id: c.id,
        type: "collection",
        title: c.name,
        subtitle: c.slug,
        href: "/admin/collections",
      });
    }
  }

  for (const o of store.orders) {
    const hay = [
      o.id,
      o.customer.name,
      o.customer.email,
      o.customer.phone,
      o.delivery.city,
      o.status,
      o.tracking,
    ]
      .filter(Boolean)
      .join(" ");
    if (match(hay, q)) {
      hits.push({
        id: o.id,
        type: "order",
        title: `${o.customer.name} · ${o.id}`,
        subtitle: `${o.status} · ${o.delivery.city}`,
        href: `/admin/orders/${o.id}`,
      });
    }
  }

  for (const c of store.customers) {
    const hay = [c.name, c.email, c.phone, c.city, ...(c.tags ?? [])]
      .filter(Boolean)
      .join(" ");
    if (match(hay, q)) {
      hits.push({
        id: c.id,
        type: "customer",
        title: c.name,
        subtitle: `${c.email} · ${c.phone}`,
        href: "/admin/customers",
      });
    }
  }

  for (const offer of store.offers) {
    const hay = [offer.name, offer.code, offer.badgeText, offer.type]
      .filter(Boolean)
      .join(" ");
    if (match(hay, q)) {
      hits.push({
        id: offer.id,
        type: "offer",
        title: offer.name,
        subtitle: offer.code ? `Code ${offer.code}` : offer.type,
        href: "/admin/offers",
      });
    }
  }

  return NextResponse.json({ hits: hits.slice(0, 40) });
}
