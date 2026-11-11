import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { availabilityLabel, formatPrice } from "@/lib/catalog";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/types";

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

        <div className="overflow-x-auto border border-ink/10 bg-ivory">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-ink/45">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = p.images.find((i) => i.src)?.src;
                return (
                  <tr key={p.id} className="border-b border-ink/10 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-stone">
                          {img ? (
                            <Image
                              src={img}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-medium text-ink">{p.name}</p>
                          <p className="text-xs text-ink/45">{p.sku ?? p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink/70">
                      {PRODUCT_CATEGORY_LABELS[p.category]}
                    </td>
                    <td className="px-4 py-3 text-ink/70">
                      {availabilityLabel(p.availability)}
                    </td>
                    <td className="px-4 py-3 text-ink/70">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-sm text-wine hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
