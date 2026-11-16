import type { FabricProduct } from "@/lib/types";

export function toMoney(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function formatPrice(
  price: number | undefined | null,
  currency = "PKR",
): string {
  const amount = toMoney(price);
  if (amount === undefined) {
    return "Price on request";
  }
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: currency || "PKR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency || "PKR"} ${amount.toLocaleString("en-PK")}`;
  }
}

/** Prefer cut price, then product price, then any priced cut option. */
export function resolveListPrice(
  product: {
    price?: number | null;
    cutOptions?: { price?: number | null }[];
  },
  selectedCut?: { price?: number | null } | null,
): number | undefined {
  return (
    toMoney(selectedCut?.price) ??
    toMoney(product.price) ??
    (product.cutOptions ?? [])
      .map((cut) => toMoney(cut.price))
      .find((value): value is number => value !== undefined)
  );
}

export function availabilityLabel(
  availability: FabricProduct["availability"],
): string {
  switch (availability) {
    case "in_stock":
      return "In stock";
    case "out_of_stock":
      return "Out of stock";
    default:
      return "Coming soon";
  }
}
