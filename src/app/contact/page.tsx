import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/home/contact-form";
import { Container } from "@/components/layout/container";
import { getSiteConfig } from "@/lib/catalog";

export const metadata = {
  title: "Contact",
  description:
    "Contact FEELINGS for fabric orders, custom lengths, and support — email, phone, WhatsApp, or Instagram.",
};

function whatsappHref(number: string) {
  const digits = number.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

export default function ContactPage() {
  const config = getSiteConfig();
  const instagram = config.social.instagram;
  const wa = config.whatsapp ? whatsappHref(config.whatsapp) : null;

  const channels = [
    config.contactEmail
      ? {
          label: "Email",
          value: config.contactEmail,
          href: `mailto:${config.contactEmail}`,
          note: "Orders, shade questions, and general support",
        }
      : null,
    config.contactPhone
      ? {
          label: "Phone",
          value: config.contactPhone,
          href: `tel:${config.contactPhone}`,
          note: "Call during business hours",
        }
      : null,
    config.whatsapp && wa
      ? {
          label: "WhatsApp",
          value: config.whatsapp,
          href: wa,
          note: "Fastest for custom lengths and quick advice",
          external: true,
        }
      : null,
    instagram
      ? {
          label: "Instagram",
          value: `@${instagram}`,
          href: `https://instagram.com/${instagram}`,
          note: "New drops, looks, and house updates",
          external: true,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string;
    note: string;
    external?: boolean;
  }[];

  return (
    <>
      {/* Editorial hero */}
      <section className="relative min-h-[58vh] overflow-hidden bg-stone text-ink md:min-h-[68vh]">
        <Image
          src="/brand/contact/hero.jpg"
          alt="FEELINGS boutique desk — reach the house"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_40%]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone/93 via-stone/60 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone/45 via-transparent to-stone/20" />
        <Container className="relative flex min-h-[58vh] flex-col justify-end pb-12 pt-28 md:min-h-[68vh] md:justify-center md:pb-20">
          <p className="text-[10px] uppercase tracking-[0.32em] text-wine md:text-[11px]">
            Elite Men&apos;s Collection
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Contact FEELINGS
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/75 md:text-base">
            Fabric advice, custom lengths, orders, and support — reach the house
            the way that suits you.
          </p>
          {wa ? (
            <div className="mt-8">
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center rounded-sm bg-ink px-6 text-sm tracking-[0.08em] text-ivory transition-transform hover:-translate-y-0.5"
              >
                Message on WhatsApp
              </a>
            </div>
          ) : null}
        </Container>
      </section>

      {/* Channels */}
      <section className="border-b border-ink/10 bg-stone">
        <Container className="py-14 md:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
              Reach us
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-4xl">
              Direct lines to the house
            </h2>
            <p className="mt-3 text-sm text-ink/65 md:text-base">
              Prefer a quick chat? WhatsApp is usually fastest. Email works well
              for longer notes and order details.
            </p>
          </div>

          <div className="grid gap-0 border-t border-ink/15 md:grid-cols-2">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className="group border-b border-ink/15 px-0 py-7 transition-colors hover:bg-ivory/50 md:px-6"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                  {channel.label}
                </p>
                <p className="mt-2 font-display text-2xl text-ink transition-colors group-hover:text-wine md:text-3xl">
                  {channel.value}
                </p>
                <p className="mt-2 text-sm text-ink/55">{channel.note}</p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Form + aside */}
      <section className="bg-ivory">
        <Container className="grid gap-12 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-24">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
              Write to us
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-4xl">
              Send a message
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/70 md:text-base">
              Tell us the collection, shade, or length you have in mind. We will
              get back with a clear next step.
            </p>

            <div className="mt-10 space-y-6 border-t border-ink/10 pt-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
                  Custom lengths
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Need 5m, 5.5m, or another cut not listed on the product page?
                  WhatsApp us and we will arrange it.
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
                  Visit the house
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Browse{" "}
                  <Link href="/collections" className="text-wine hover:underline">
                    collections
                  </Link>{" "}
                  online, or ask us anything about unstitched cloth, shalwar
                  kameez, and dress shirts.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-ink/10 bg-stone/40 p-6 md:p-8">
            <ContactForm />
          </div>
        </Container>
      </section>

      {/* Closing band */}
      <section className="bg-ink text-ivory">
        <Container className="flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/50">
              FEELINGS
            </p>
            <p className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
              Quiet luxury, close at hand.
            </p>
            <p className="mt-3 text-sm text-ivory/65">
              We are here for fabric, form, and the details in between.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center rounded-sm bg-ivory px-6 text-sm tracking-wide text-ink"
              >
                WhatsApp FEELINGS
              </a>
            ) : null}
            <Link
              href="/shop"
              className="inline-flex h-12 items-center rounded-sm border border-ivory/50 px-6 text-sm tracking-wide text-ivory hover:bg-ivory hover:text-ink"
            >
              Shop the collection
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
