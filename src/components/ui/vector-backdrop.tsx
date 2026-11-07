import { cn } from "@/lib/cn";

/** Soft geometric vectors — restrained heritage lines, not ornamental clutter. */
export function VectorBackdrop({
  variant = "stone",
  className,
}: {
  variant?: "stone" | "ivory" | "ink";
  className?: string;
}) {
  const stroke =
    variant === "ink"
      ? "rgba(245,241,233,0.12)"
      : variant === "ivory"
        ? "rgba(23,23,23,0.08)"
        : "rgba(23,23,23,0.07)";
  const accent =
    variant === "ink" ? "rgba(107,38,56,0.22)" : "rgba(107,38,56,0.12)";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <svg
        className="absolute -right-16 -top-20 h-[28rem] w-[28rem] opacity-80"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="150" stroke={stroke} strokeWidth="1" />
        <circle cx="200" cy="200" r="110" stroke={stroke} strokeWidth="1" />
        <circle cx="200" cy="200" r="70" stroke={accent} strokeWidth="1" />
        <path
          d="M80 200c40-55 80-55 120 0s80 55 120 0"
          stroke={stroke}
          strokeWidth="1"
        />
      </svg>
      <svg
        className="absolute -bottom-24 -left-10 h-[22rem] w-[22rem] opacity-70"
        viewBox="0 0 360 360"
        fill="none"
      >
        <rect
          x="40"
          y="40"
          width="280"
          height="280"
          stroke={stroke}
          strokeWidth="1"
        />
        <rect
          x="80"
          y="80"
          width="200"
          height="200"
          stroke={stroke}
          strokeWidth="1"
        />
        <path d="M40 180h280M180 40v280" stroke={stroke} strokeWidth="1" />
        <circle cx="180" cy="180" r="18" stroke={accent} strokeWidth="1" />
      </svg>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(115deg, transparent 0 48%, ${stroke} 49%, transparent 50%)`,
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}
