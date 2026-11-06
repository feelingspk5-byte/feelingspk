import { cn } from "@/lib/cn";

export function FabricPlaceholder({
  label = "Fabric image pending",
  className,
  aspect = "portrait",
}: {
  label?: string;
  className?: string;
  aspect?: "portrait" | "square" | "wide" | "hero";
}) {
  const aspectClass =
    aspect === "hero"
      ? "aspect-[16/10] md:aspect-[21/9]"
      : aspect === "wide"
        ? "aspect-[16/9]"
        : aspect === "square"
          ? "aspect-square"
          : "aspect-[3/4]";

  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden rounded-sm border border-ink/10 bg-stone-deep/40",
        aspectClass,
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(23,23,23,0.08) 0%, transparent 45%, rgba(107,38,56,0.08) 100%), repeating-linear-gradient(90deg, rgba(23,23,23,0.03) 0 1px, transparent 1px 12px)",
        }}
      />
      <span className="relative m-3 rounded-sm bg-ivory/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-ink/70">
        {label}
      </span>
    </div>
  );
}
