import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoVariant = "header" | "footer" | "hero";

const assets: Record<
  LogoVariant,
  { src: string; width: number; height: number; className: string }
> = {
  header: {
    src: "/brand/feelings-logo-ink.png",
    width: 220,
    height: 147,
    className: "h-11 w-auto md:h-12",
  },
  footer: {
    src: "/brand/feelings-logo-transparent.png",
    width: 280,
    height: 187,
    className: "h-24 w-auto sm:h-28",
  },
  hero: {
    src: "/brand/feelings-logo-ink.png",
    width: 520,
    height: 347,
    className: "h-auto w-full max-w-md md:max-w-lg",
  },
};

export function BrandLogo({
  variant = "header",
  className,
  priority = false,
}: {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}) {
  const asset = assets[variant];

  return (
    <Image
      src={asset.src}
      alt="FEELINGS — Men's Unstitched Fabrics"
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={cn(asset.className, className)}
    />
  );
}
