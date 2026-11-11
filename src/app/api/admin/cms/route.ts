import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore, updateStore } from "@/lib/store/file-store";
import type { CmsContent } from "@/lib/store/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ cms: readStore().cms });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as CmsContent;
  await updateStore((draft) => {
    draft.cms = body;
    pushAudit(draft, session.email, "cms.update", "Homepage & pages");
  });
  return NextResponse.json({ ok: true });
}
