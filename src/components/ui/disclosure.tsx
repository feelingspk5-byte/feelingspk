"use client";

import { useState } from "react";
import { IconChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function Disclosure({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ink/15">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium uppercase tracking-[0.12em] text-ink"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <IconChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-feel",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="pb-4 text-sm leading-relaxed text-ink/70">{children}</div>
      ) : null}
    </div>
  );
}
