import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoVariant = "header" | "footer" | "hero" | "heroDark";

const assets: Record<
  LogoVariant,
  { src: string; width: number; height: number; className: string }
> = {
  header: {
    src: "/brand/feelings-logo-ink.png",
    width: 180,
    height: 110,
    className: "h-9 w-auto md:h-10",
  },
  footer: {
    src: "/brand/feelings-logo-transparent.png",
    width: 280,
    height: 172,
    className: "h-20 w-auto sm:h-24",
  },
  hero: {
    src: "/brand/feelings-logo-ink.png",
    width: 420,
    height: 257,
    className: "h-auto w-full max-w-xs md:max-w-sm",
  },
  heroDark: {
    src: "/brand/feelings-logo-transparent.png",
    width: 480,
    height: 294,
    className: "h-auto w-full max-w-[16rem] sm:max-w-xs md:max-w-sm",
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
      alt="FEELINGS — Elite Men's Collection"
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={cn(asset.className, className)}
    />
  );
}
