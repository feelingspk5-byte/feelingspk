import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "wine" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-ivory hover:bg-ink/90 disabled:bg-ink/40 disabled:text-ivory/70",
  secondary:
    "bg-ivory text-ink border border-ink/15 hover:border-ink/40 disabled:opacity-50",
  ghost: "bg-transparent text-ink hover:bg-ink/5 disabled:opacity-50",
  wine: "bg-wine text-ivory hover:bg-wine-soft disabled:opacity-50",
  outline:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-ivory disabled:opacity-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-colors duration-feel disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
