import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/cms", label: "Website" },
  { href: "/admin/shipping", label: "Shipping" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/returns", label: "Returns" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/audit", label: "Audit" },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  return (
    <div className="min-h-screen bg-stone text-ink">
      <header className="border-b border-ink/10 bg-ivory">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-wine">
              FEELINGS Admin
            </p>
            <p className="font-display text-xl tracking-tight">Control panel</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-ink/50 sm:inline">{email}</span>
            <Link
              href="/"
              className="text-ink/60 transition-colors hover:text-wine"
            >
              View store
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 md:px-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-sm px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-stone hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        {children}
      </main>
    </div>
  );
}
