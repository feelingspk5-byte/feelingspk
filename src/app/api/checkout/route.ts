import { NextResponse } from "next/server";
import {
  calcDiscount,
  findOfferByCode,
  resolveShipping,
} from "@/lib/store/commerce";
import { ensureStore, readStore, updateStore } from "@/lib/store/file-store";
import { newId } from "@/lib/store/ids";
import type { CustomerRecord, Order, OrderLine } from "@/lib/store/types";

function upsertCustomer(
  draft: { customers: CustomerRecord[] },
  input: {
    name: string;
    email: string;
    phone: string;
    city: string;
    spent: number;
  },
) {
  const email = input.email.toLowerCase();
  const existing = draft.customers.find((c) => c.email.toLowerCase() === email);
  const now = new Date().toISOString();
  if (existing) {
    existing.name = input.name;
    existing.phone = input.phone;
    existing.city = input.city;
    existing.orderCount += 1;
    existing.totalSpent += input.spent;
    existing.updatedAt = now;
    existing.lastOrderAt = now;
    return;
  }
  draft.customers.unshift({
    id: newId("cust"),
    name: input.name,
    email,
    phone: input.phone,
    city: input.city,
    tags: [],
    orderCount: 1,
    totalSpent: input.spent,
    createdAt: now,
    updatedAt: now,
    lastOrderAt: now,
  });
}

export async function POST(request: Request) {
  await ensureStore();

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
    couponCode?: string;
  };

  const name = body.customer?.name?.trim();
  const email = body.customer?.email?.trim();
  const phone = body.customer?.phone?.trim();
  const address = body.delivery?.address?.trim();
  const city = body.delivery?.city?.trim();
  const lines = body.lines ?? [];
  const config = readStore().siteConfig;

  if (!name || !email || !phone || !address || !city || lines.length === 0) {
    return NextResponse.json(
      { error: "Missing required checkout fields." },
      { status: 400 },
    );
  }

  if (!config.paymentMethods.includes("Cash on Delivery") && !config.checkoutConnected) {
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable." },
      { status: 400 },
    );
  }

  const currency = config.currencyPlaceholder;
  const subtotal = lines.every((l) => typeof l.unitPrice === "number")
    ? lines.reduce((sum, l) => sum + (l.unitPrice ?? 0) * l.quantity, 0)
    : undefined;

  let discountAmount = 0;
  let couponCode: string | undefined;
  const offer = body.couponCode
    ? findOfferByCode(body.couponCode)
    : undefined;
  if (offer && subtotal !== undefined) {
    if (offer.type === "free_shipping") {
      couponCode = offer.code;
    } else {
      discountAmount = calcDiscount(offer, subtotal);
      if (discountAmount > 0) couponCode = offer.code;
    }
  }

  const afterDiscount =
    subtotal === undefined ? undefined : Math.max(0, subtotal - discountAmount);

  let shippingAmount = 0;
  if (afterDiscount !== undefined) {
    const shipping = resolveShipping(city, afterDiscount);
    if (offer?.type === "free_shipping") {
      shippingAmount = 0;
    } else {
      shippingAmount = shipping.amount;
    }
  }

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
    discountAmount: discountAmount || undefined,
    shippingAmount,
    currency,
    couponCode,
  };

  await updateStore((draft) => {
    draft.orders.unshift(order);
    if (offer) {
      const live = draft.offers.find((o) => o.id === offer.id);
      if (live) live.usedCount += 1;
    }
    upsertCustomer(draft, {
      name,
      email,
      phone,
      city,
      spent: afterDiscount ?? 0,
    });
  });

  return NextResponse.json({ order }, { status: 201 });
}
