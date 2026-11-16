import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { FooterSignup } from "@/components/layout/footer-signup";
import { getCms, getSiteConfig } from "@/lib/catalog";

const promises = [
  {
    title: "Secure transactions",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        aria-hidden
      >
        <path d="M24 6 10 12v10c0 10.5 6.2 17.4 14 20 7.8-2.6 14-9.5 14-20V12L24 6Z" />
        <path d="m18 24 4.2 4.2L30.5 20" />
      </svg>
    ),
  },
  {
    title: "Timely delivery",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        aria-hidden
      >
        <path d="M4 30h28V16H4v14Z" />
        <path d="M32 22h7l5 6v2h-12v-8Z" />
        <circle cx="12" cy="34" r="3.2" />
        <circle cx="36" cy="34" r="3.2" />
        <path d="M4 26h10" />
      </svg>
    ),
  },
  {
    title: "Effortless shopping",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        aria-hidden
      >
        <path d="M20 30c-5 0-9-3.2-9-8.2C11 15 16 10 22.5 10c4.2 0 6.8 1.8 8.5 4.2" />
        <path d="M28 18v12.5c0 3.2 1.6 5.5 5 5.5 4.2 0 6.5-3.5 6.5-8.2V22" />
        <path d="M28 22h7.5" />
        <path d="m34 8 1.2 3.4L38.5 13l-3.3 1.2L34 17.5l-1.2-3.3L29.5 13l3.3-1.6L34 8Z" />
      </svg>
    ),
  },
  {
    title: "Consistent customer support",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        aria-hidden
      >
        <path d="M10 14h18a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H20l-6 5v-5h-4a6 6 0 0 1-6-6v-6a6 6 0 0 1 6-6Z" />
        <path d="M28 18h8a5 5 0 0 1 5 5v5a5 5 0 0 1-5 5h-2l-4 4v-4" />
      </svg>
    ),
  },
];

const primaryLinks = [
  { href: "/about", label: "About Us" },
  { href: "/collections", label: "Collections" },
  { href: "/faq", label: "FAQs" },
  { href: "/exchanges", label: "Return, Refund and Exchange Policy" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
];

const secondaryLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/shipping", label: "Shipping" },
  { href: "/terms", label: "Terms of Service" },
];

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="text-ivory/80 transition-colors hover:text-ivory"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const config = getSiteConfig();
  const cms = getCms();
  const year = new Date().getFullYear();

  const instagram = config.social.instagram
    ? `https://instagram.com/${config.social.instagram.replace(/^@/, "")}`
    : null;
  const facebook = config.social.facebook
    ? config.social.facebook.startsWith("http")
      ? config.social.facebook
      : `https://facebook.com/${config.social.facebook}`
    : null;
  const whatsapp = config.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, "").replace(/^0/, "92")}`
    : null;

  return (
    <footer className="mt-auto bg-ink text-ivory">
      {/* Service promises */}
      <div className="border-b border-ivory/15">
        <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 md:gap-8 md:py-16">
          {promises.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              <span className="text-ivory">{item.icon}</span>
              <p className="mt-4 max-w-[11rem] font-display text-[13px] leading-snug tracking-[0.06em] text-ivory sm:text-sm md:text-[15px]">
                {item.title}
              </p>
            </div>
          ))}
        </Container>
      </div>

      {/* Links + signup */}
      <Container className="grid gap-12 py-14 md:grid-cols-12 md:gap-8 md:py-16">
        <div className="md:col-span-4 lg:col-span-3">
          <Link href="/" aria-label="FEELINGS home" className="inline-block">
            <BrandLogo variant="footer" className="h-16 w-auto sm:h-20" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/60">
            {cms.footerNote ||
              "Quiet luxury for the modern gentleman — fabric, shalwar kameez, and dress shirts under one house."}
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="md:col-span-4 lg:col-span-3"
        >
          <ul className="space-y-3">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[12px] uppercase tracking-[0.14em] text-ivory/85 transition-colors hover:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          aria-label="Store"
          className="md:col-span-4 lg:col-span-2"
        >
          <ul className="space-y-3">
            {secondaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[12px] uppercase tracking-[0.14em] text-ivory/85 transition-colors hover:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {config.contactEmail ? (
              <li>
                <a
                  href={`mailto:${config.contactEmail}`}
                  className="text-[12px] uppercase tracking-[0.14em] text-ivory/85 transition-colors hover:text-ivory"
                >
                  Email Us
                </a>
              </li>
            ) : null}
          </ul>
        </nav>

        <div className="md:col-span-12 lg:col-span-4">
          <FooterSignup />

          <div className="mt-8 flex flex-wrap items-center gap-5">
            {instagram ? (
              <SocialLink href={instagram} label="Instagram">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </SocialLink>
            ) : null}
            {facebook ? (
              <SocialLink href={facebook} label="Facebook">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13v-2c0-.6.4-1 1-1Z" />
                </svg>
              </SocialLink>
            ) : null}
            {whatsapp ? (
              <SocialLink href={whatsapp} label="WhatsApp">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.96.52 3.8 1.44 5.4L2 22l4.92-1.55a9.86 9.86 0 0 0 5.12 1.4h.01c5.46 0 9.89-4.4 9.89-9.84S17.5 2 12.04 2Zm0 17.88h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.04.96 1-2.96-.2-.3a8.05 8.05 0 0 1-1.24-4.3c0-4.47 3.66-8.1 8.17-8.1 4.5 0 8.16 3.63 8.16 8.1 0 4.48-3.66 8.11-8.16 8.11Zm4.47-5.98c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.29.18-.53.06-.24-.12-1.02-.37-1.95-1.2-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.29.37-.43.12-.14.16-.24.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.2 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
                </svg>
              </SocialLink>
            ) : null}
            {!instagram && !facebook && !whatsapp ? (
              <p className="text-xs text-ivory/45">
                Add social links in Admin → Settings
              </p>
            ) : null}
          </div>
        </div>
      </Container>

      <div className="border-t border-ivory/15">
        <Container className="py-6 text-center">
          <p className="text-xs tracking-[0.04em] text-ivory/55">
            © {year} {config.brandName || "FEELINGS"}
            {config.tagline ? ` — ${config.tagline}` : ""}
          </p>
        </Container>
      </div>
    </footer>
  );
}
