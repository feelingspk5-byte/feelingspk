import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { SalePricing } from "@/lib/store/sale-pricing";

export function SalePrice({
  price,
  currency = "PKR",
  sale,
  className,
  size = "md",
  align = "start",
}: {
  price: number | undefined;
  currency?: string;
  sale?: SalePricing | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  align?: "start" | "center";
}) {
  if (sale) {
    return (
      <p
        className={cn(
          "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-ink",
          align === "center" && "justify-center text-center",
          size === "sm" && "text-sm",
          size === "md" && "text-sm",
          size === "lg" && "text-2xl",
          className,
        )}
      >
        <span
          className={cn(
            "text-ink/45 line-through decoration-ink/50",
            size === "lg" ? "text-base font-normal" : "text-xs font-normal",
          )}
        >
          {formatPrice(sale.original, currency)}
        </span>
        <span className={cn("font-semibold text-ink", size === "lg" && "text-2xl")}>
          {formatPrice(sale.sale, currency)}
        </span>
        <span
          className={cn(
            "font-normal text-ink/55",
            size === "lg" ? "text-sm" : "text-xs",
          )}
        >
          Save {sale.savePercent}%
        </span>
      </p>
    );
  }

  return (
    <p
      className={cn(
        "text-ink",
        size === "sm" && "text-sm",
        size === "md" && "text-sm",
        size === "lg" && "text-2xl",
        align === "center" && "text-center",
        className,
      )}
    >
      {formatPrice(price, currency)}
    </p>
  );
}

export function SaleBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "absolute right-2 top-2 rounded-sm bg-wine px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ivory",
        className,
      )}
    >
      {label}
    </span>
  );
}
