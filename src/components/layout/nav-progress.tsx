"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Slim top progress bar so page changes feel immediate. */
export function NavProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const done = window.setTimeout(() => setVisible(false), 450);
    return () => window.clearTimeout(done);
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-wine transition-transform duration-300",
        visible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
      ].join(" ")}
    />
  );
}
