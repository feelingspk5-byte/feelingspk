import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/product-editor";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const store = readStore();
  const product = store.products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <AdminShell email={session.email}>
      <ProductEditor initial={product} collections={store.collections} />
    </AdminShell>
  );
}
