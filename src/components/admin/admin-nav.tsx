"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "Work",
    items: [
      { href: "/admin", label: "Overview" },
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/customers", label: "Customers" },
      { href: "/admin/returns", label: "Returns" },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/collections", label: "Collections" },
      { href: "/admin/media", label: "Media" },
      { href: "/admin/offers", label: "Offers" },
    ],
  },
  {
    title: "Store",
    items: [
      { href: "/admin/cms", label: "Website" },
      { href: "/admin/shipping", label: "Shipping" },
      { href: "/admin/settings", label: "Settings" },
      { href: "/admin/analytics", label: "Analytics" },
      { href: "/admin/audit", label: "Audit" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.2em] text-ivory/35">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "block rounded-sm px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-ivory/12 font-medium text-ivory"
                        : "text-ivory/55 hover:bg-ivory/[0.06] hover:text-ivory",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
