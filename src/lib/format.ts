import type { FabricProduct } from "@/lib/types";

export function formatPrice(
  price: number | undefined,
  currency = "PKR",
): string {
  if (price === undefined || Number.isNaN(price)) {
    return "—";
  }
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString("en-PK")}`;
  }
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
