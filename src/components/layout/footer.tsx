import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { getSiteConfig } from "@/lib/catalog";

const shopLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/collections", label: "Collections" },
  { href: "/shop?filter=new", label: "New Arrivals" },
];

const helpLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping" },
  { href: "/exchanges", label: "Exchanges & Returns" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  const config = getSiteConfig();

  return (
    <footer className="mt-auto border-t border-ink/15 bg-ink text-ivory">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" aria-label="FEELINGS home" className="inline-block">
            <BrandLogo variant="footer" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
            Elite Men&apos;s Collection — unstitched fabric, stitched shalwar
            kameez, and dress shirts.
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ivory/50">
            Shop
          </p>
          <ul className="mt-4 space-y-2">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ivory/80 transition-colors hover:text-ivory"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ivory/50">
            Help
          </p>
          <ul className="mt-4 space-y-2">
            {helpLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ivory/80 transition-colors hover:text-ivory"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ivory/50">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>
              {config.contactEmail ? (
                <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
              ) : (
                <span>Email pending owner confirmation</span>
              )}
            </li>
            <li>
              {config.contactPhone ? (
                <a href={`tel:${config.contactPhone}`}>{config.contactPhone}</a>
              ) : (
                <span>Phone / WhatsApp pending confirmation</span>
              )}
            </li>
          </ul>
          <ul className="mt-6 space-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ivory/60 transition-colors hover:text-ivory"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-ivory/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FEELINGS. All rights reserved.</p>
          <p>Elite Men&apos;s Collection by FEELINGS.</p>
        </Container>
      </div>
    </footer>
  );
}
