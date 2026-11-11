import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrderDetail } from "@/components/admin/order-detail";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const order = readStore().orders.find((o) => o.id === id);
  if (!order) notFound();

  return (
    <AdminShell email={session.email}>
      <div className="mb-6">
        <Link href="/admin/orders" className="text-sm text-ink/55 hover:text-wine">
          ← Orders
        </Link>
        <h1 className="mt-3 font-display text-3xl tracking-tight">
          Order {order.id}
        </h1>
      </div>
      <OrderDetail order={order} />
    </AdminShell>
  );
}
