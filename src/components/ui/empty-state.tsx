import { cn } from "@/lib/cn";

export function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-sm border border-dashed border-ink/20 bg-ivory/70 px-6 py-12 text-center",
        className,
      )}
    >
      <p className="font-display text-xl text-ink">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">{description}</p>
      ) : null}
    </div>
  );
}
