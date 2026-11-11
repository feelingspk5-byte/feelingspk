import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ShippingManager } from "@/components/admin/shipping-manager";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminShippingPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Shipping</h1>
          <p className="mt-2 text-sm text-ink/60">
            City/zone COD rates and free-shipping thresholds.
          </p>
        </div>
        <ShippingManager initial={readStore().shippingZones} />
      </div>
    </AdminShell>
  );
}
