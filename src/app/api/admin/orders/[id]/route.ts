import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore, updateStore } from "@/lib/store/file-store";
import type { Order, OrderStatus } from "@/lib/store/types";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "packing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function GET(_request: Request, ctx: Ctx) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const order = readStore().orders.find((o) => o.id === id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await request.json()) as Partial<
    Pick<Order, "status" | "internalNotes" | "tracking">
  >;

  if (body.status && !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  let updated: Order | null = null;
  await updateStore((draft) => {
    const idx = draft.orders.findIndex((o) => o.id === id);
    if (idx < 0) return;
    draft.orders[idx] = {
      ...draft.orders[idx],
      status: body.status ?? draft.orders[idx].status,
      internalNotes:
        body.internalNotes !== undefined
          ? body.internalNotes
          : draft.orders[idx].internalNotes,
      tracking:
        body.tracking !== undefined
          ? body.tracking
          : draft.orders[idx].tracking,
      updatedAt: new Date().toISOString(),
    };
    updated = draft.orders[idx];
  });

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ order: updated });
}
