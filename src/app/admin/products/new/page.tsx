import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/product-editor";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminNewProductPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const collections = readStore().collections;

  return (
    <AdminShell email={session.email}>
      <ProductEditor collections={collections} />
    </AdminShell>
  );
}
