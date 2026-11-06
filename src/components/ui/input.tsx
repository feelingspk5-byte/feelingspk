import { cn } from "@/lib/cn";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-sm border border-ink/20 bg-ivory px-3 text-sm text-ink placeholder:text-ink/45 transition-colors duration-feel focus:border-wine focus:outline-none focus-visible:ring-2 focus-visible:ring-wine/30 disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
