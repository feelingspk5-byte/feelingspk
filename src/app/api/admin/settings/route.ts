import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore, updateStore } from "@/lib/store/file-store";
import type { SiteConfig } from "@/lib/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  return NextResponse.json({ siteConfig: readStore().siteConfig });
}
