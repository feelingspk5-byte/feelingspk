import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { ensureStore, readStore, updateStore } from "@/lib/store/file-store";
import { revalidateStorefront } from "@/lib/store/revalidate-storefront";
import type { SiteConfig } from "@/lib/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureStore();
  return NextResponse.json({ siteConfig: readStore().siteConfig });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Partial<SiteConfig>;
  await updateStore((draft) => {
    draft.siteConfig = { ...draft.siteConfig, ...body };
    pushAudit(draft, session.email, "settings.update", "Store settings");
  });
  revalidateStorefront();
  return NextResponse.json({ siteConfig: readStore().siteConfig });
}
