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
  price: number | undefined | null;
  currency?: string;
  sale?: SalePricing | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  align?: "start" | "center";
}) {
  if (sale) {
    return (
      <div
        className={cn(
          "flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-ink",
          align === "center" && "justify-center text-center",
          className,
        )}
      >
        <span
          className={cn(
            "font-semibold text-ink",
            size === "sm" && "text-base",
            size === "md" && "text-lg",
            size === "lg" && "text-2xl md:text-3xl",
          )}
        >
          {formatPrice(sale.sale, currency)}
        </span>
        <span
          className={cn(
            "text-ink/45 line-through decoration-ink/45",
            size === "lg" ? "text-sm md:text-base" : "text-xs",
          )}
        >
          {formatPrice(sale.original, currency)}
        </span>
        <span
          className={cn(
            "rounded-sm bg-wine/10 px-1.5 py-0.5 font-medium text-wine",
            size === "lg" ? "text-xs md:text-sm" : "text-[11px]",
          )}
        >
          Save {sale.savePercent}%
        </span>
      </div>
    );
  }

  const hasPrice = typeof price === "number" && Number.isFinite(price);

  return (
    <p
      className={cn(
        hasPrice ? "font-semibold text-ink" : "font-medium text-ink/70",
        size === "sm" && "text-base",
        size === "md" && "text-lg",
        size === "lg" && "text-2xl md:text-3xl",
        align === "center" && "text-center",
        className,
      )}
    >
      {formatPrice(price ?? undefined, currency)}
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
