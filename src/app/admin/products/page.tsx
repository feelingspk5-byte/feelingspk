import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductsTable } from "@/components/admin/products-table";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const products = readStore().products;

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-tight">Products</h1>
            <p className="mt-2 text-sm text-ink/60">
              Add or edit fabrics and garments. They appear on the shop
              immediately after save.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center rounded-sm bg-ink px-5 text-sm text-ivory"
          >
            Add product
          </Link>
        </div>

        <ProductsTable products={products} />
      </div>
    </AdminShell>
  );
}
