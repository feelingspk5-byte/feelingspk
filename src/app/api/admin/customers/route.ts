import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore, updateStore } from "@/lib/store/file-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customers = [...readStore().customers].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  return NextResponse.json({ customers });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { id?: string; tags?: string[] };
  if (!body.id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  await updateStore((draft) => {
    const c = draft.customers.find((x) => x.id === body.id);
    if (c && body.tags) {
      c.tags = body.tags;
      c.updatedAt = new Date().toISOString();
      pushAudit(draft, session.email, "customer.tags", c.email);
    }
  });
  return NextResponse.json({ ok: true });
}
