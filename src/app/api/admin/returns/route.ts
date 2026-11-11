import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore, updateStore } from "@/lib/store/file-store";
import { newId } from "@/lib/store/ids";
import type { ReturnRequest, ReturnStatus } from "@/lib/store/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ returns: readStore().returns });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Partial<ReturnRequest>;
  if (!body.orderId || !body.reason?.trim()) {
    return NextResponse.json(
      { error: "Order and reason required." },
      { status: 400 },
    );
  }
  const order = readStore().orders.find((o) => o.id === body.orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  const now = new Date().toISOString();
  const item: ReturnRequest = {
    id: newId("ret"),
    orderId: order.id,
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    reason: body.reason.trim(),
    status: "requested",
    notes: body.notes,
    createdAt: now,
    updatedAt: now,
  };
  await updateStore((draft) => {
    draft.returns.unshift(item);
    pushAudit(draft, session.email, "return.create", order.id);
  });
  return NextResponse.json({ return: item }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as {
    id?: string;
    status?: ReturnStatus;
    notes?: string;
  };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }
  await updateStore((draft) => {
    const item = draft.returns.find((r) => r.id === body.id);
    if (item) {
      item.status = body.status!;
      if (body.notes !== undefined) item.notes = body.notes;
      item.updatedAt = new Date().toISOString();
      pushAudit(draft, session.email, "return.status", `${item.id} → ${body.status}`);
    }
  });
  return NextResponse.json({ ok: true });
}
