import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { updateStore } from "@/lib/store/file-store";
import { revalidateStorefront } from "@/lib/store/revalidate-storefront";
import type { Availability, PublishStatus } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    ids?: string[];
    action?:
      | "delete"
      | "publish"
      | "draft"
      | "feature"
      | "unfeature"
      | "in_stock"
      | "out_of_stock";
  };

  const ids = body.ids ?? [];
  if (!ids.length || !body.action) {
    return NextResponse.json({ error: "ids and action required." }, { status: 400 });
  }

  await updateStore((draft) => {
    if (body.action === "delete") {
      draft.products = draft.products.filter((p) => !ids.includes(p.id));
      pushAudit(draft, session.email, "products.bulk_delete", `${ids.length} items`);
      return;
    }

    for (const p of draft.products) {
      if (!ids.includes(p.id)) continue;
      p.updatedAt = new Date().toISOString();
      if (body.action === "publish") p.publishStatus = "published" as PublishStatus;
      if (body.action === "draft") p.publishStatus = "draft" as PublishStatus;
      if (body.action === "feature") p.featured = true;
      if (body.action === "unfeature") p.featured = false;
      if (body.action === "in_stock") p.availability = "in_stock" as Availability;
      if (body.action === "out_of_stock") p.availability = "out_of_stock" as Availability;
    }
    pushAudit(draft, session.email, `products.bulk_${body.action}`, `${ids.length} items`);
  });
  revalidateStorefront();

  return NextResponse.json({ ok: true, count: ids.length });
}
