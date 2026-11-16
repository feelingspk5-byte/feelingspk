import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminSearch } from "@/components/admin/admin-search";
import { AdminShortcuts } from "@/components/admin/admin-shortcuts";
import { StoreBackendBanner } from "@/components/admin/store-backend-banner";

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  return (
    <div className="admin-workspace min-h-screen bg-[#ebe6dc] text-ink">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[15.5rem] shrink-0 flex-col bg-[#14110f] text-ivory lg:flex">
          <div className="border-b border-ivory/10 px-5 py-6">
            <p className="font-display text-2xl tracking-tight text-ivory">
              FEELINGS
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ivory/40">
              Staff desk
            </p>
          </div>
          <AdminNav />
          <div className="mt-auto border-t border-ivory/10 px-5 py-4">
            <p className="truncate text-xs text-ivory/45">{email}</p>
            <Link
              href="/"
              className="mt-2 inline-block text-xs text-ivory/55 transition-colors hover:text-ivory"
            >
              View storefront →
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <StoreBackendBanner />
          <header className="sticky top-0 z-30 border-b border-ink/10 bg-[#f7f3eb]/95 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
              <div className="min-w-0 lg:hidden">
                <p className="font-display text-lg tracking-tight">FEELINGS</p>
                <p className="truncate text-[10px] uppercase tracking-[0.18em] text-ink/40">
                  Staff desk · {email}
                </p>
              </div>
              <div className="hidden lg:block">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink/40">
                  Operations
                </p>
                <p className="font-display text-lg tracking-tight text-ink">
                  Focus on the next client
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <AdminSearch />
                <AdminLogoutButton />
              </div>
            </div>
            <div className="overflow-x-auto border-t border-ink/5 px-2 pb-2 lg:hidden">
              <MobileNavStrip />
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-10 lg:px-8">
            {children}
          </main>

          <footer className="border-t border-ink/8 px-4 py-4 text-center text-[11px] text-ink/35 md:px-6">
            Press <kbd className="rounded-sm border border-ink/15 bg-ivory px-1">?</kbd>{" "}
            for shortcuts ·{" "}
            <kbd className="rounded-sm border border-ink/15 bg-ivory px-1">⌘K</kbd>{" "}
            to search
          </footer>
        </div>
      </div>
      <AdminShortcuts />
    </div>
  );
}

function MobileNavStrip() {
  const items = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/offers", label: "Offers" },
    { href: "/admin/cms", label: "Website" },
    { href: "/admin/shipping", label: "Shipping" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/returns", label: "Returns" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/collections", label: "Collections" },
    { href: "/admin/audit", label: "Audit" },
  ];

  return (
    <nav className="flex gap-1 pt-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="whitespace-nowrap rounded-sm px-3 py-2 text-xs text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
