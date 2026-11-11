import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { OffersManager } from "@/components/admin/offers-manager";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminOffersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Offers</h1>
          <p className="mt-2 text-sm text-ink/60">
            Coupons, percent/fixed discounts, free shipping, and sale badges.
          </p>
        </div>
        <OffersManager initial={readStore().offers} />
      </div>
    </AdminShell>
  );
}
