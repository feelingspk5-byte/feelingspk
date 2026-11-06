import { cn } from "@/lib/cn";
import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full rounded-sm border border-ink/20 bg-ivory px-3 py-2.5 text-sm text-ink placeholder:text-ink/45 transition-colors duration-feel focus:border-wine focus:outline-none focus-visible:ring-2 focus-visible:ring-wine/30 disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
