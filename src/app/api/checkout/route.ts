import { NextResponse } from "next/server";
import { readStore, updateStore } from "@/lib/store/file-store";
import { newId } from "@/lib/store/ids";
import type { Order, OrderLine } from "@/lib/store/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    customer?: { name?: string; email?: string; phone?: string };
    delivery?: {
      address?: string;
      city?: string;
      postal?: string;
      notes?: string;
    };
    lines?: OrderLine[];
    paymentMethod?: string;
  };

  const name = body.customer?.name?.trim();
  const email = body.customer?.email?.trim();
  const phone = body.customer?.phone?.trim();
  const address = body.delivery?.address?.trim();
  const city = body.delivery?.city?.trim();
  const lines = body.lines ?? [];

  if (!name || !email || !phone || !address || !city || lines.length === 0) {
    return NextResponse.json(
      { error: "Missing required checkout fields." },
      { status: 400 },
    );
  }

  const currency = readStore().siteConfig.currencyPlaceholder;
  const subtotal = lines.every((l) => typeof l.unitPrice === "number")
    ? lines.reduce((sum, l) => sum + (l.unitPrice ?? 0) * l.quantity, 0)
    : undefined;

  const now = new Date().toISOString();
  const order: Order = {
    id: newId("ord"),
    createdAt: now,
    updatedAt: now,
    status: "pending",
    paymentMethod: "Cash on Delivery",
    customer: { name, email, phone },
    delivery: {
      address,
      city,
      postal: body.delivery?.postal?.trim() || undefined,
      notes: body.delivery?.notes?.trim() || undefined,
    },
    lines,
    subtotal,
    currency,
  };

  await updateStore((draft) => {
    draft.orders.unshift(order);
  });

  return NextResponse.json({ order }, { status: 201 });
}
