"use client";

import Link from "next/link";

export function PrintActions({ orderId }: { orderId: string }) {
  return (
    <div className="no-print mb-6 flex gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="border border-ink bg-ink px-4 py-2 text-sm text-ivory"
      >
        Print
      </button>
      <Link
        href={`/admin/orders/${orderId}`}
        className="border border-ink px-4 py-2 text-sm text-ink"
      >
        Back to order
      </Link>
    </div>
  );
}
