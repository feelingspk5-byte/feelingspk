import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

function csvEscape(value: string | number | undefined | null) {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = [
    "id",
    "createdAt",
    "status",
    "customerName",
    "email",
    "phone",
    "city",
    "address",
    "subtotal",
    "shipping",
    "discount",
    "coupon",
    "tracking",
    "items",
  ];

  const rows = readStore().orders.map((o) =>
    [
      o.id,
      o.createdAt,
      o.status,
      o.customer.name,
      o.customer.email,
      o.customer.phone,
      o.delivery.city,
      o.delivery.address,
      o.subtotal ?? "",
      o.shippingAmount ?? "",
      o.discountAmount ?? "",
      o.couponCode ?? "",
      o.tracking ?? "",
      o.lines
        .map(
          (l) =>
            `${l.productName} x${l.quantity}${l.colourName ? ` (${l.colourName})` : ""}`,
        )
        .join(" | "),
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="feelings-orders.csv"',
    },
  });
}
