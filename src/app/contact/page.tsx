import { ContactForm } from "@/components/home/contact-form";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getSiteConfig } from "@/lib/catalog";

export const metadata = {
  title: "Contact",
  description: "Contact FEELINGS for fabric orders and support.",
};

function whatsappHref(number: string) {
  const digits = number.replace(/\D/g, "");
  // Pakistan local 03… → international 92…
  const intl = digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

export default function ContactPage() {
  const config = getSiteConfig();
  const instagram = config.social.instagram;

  return (
    <>
      <PageHeader
        title="Contact"
        description="Reach FEELINGS by email, phone, WhatsApp, or Instagram — we are here for fabric, orders, and support."
      />
      <Container className="grid gap-10 py-10 md:grid-cols-2 md:py-14">
        <div className="space-y-5 text-sm text-ink/75">
          <p>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-ink/45">
              Email
            </span>
            {config.contactEmail ? (
              <a
                href={`mailto:${config.contactEmail}`}
                className="text-ink transition-colors hover:text-wine"
              >
                {config.contactEmail}
              </a>
            ) : (
              "Pending"
            )}
          </p>
          <p>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-ink/45">
              Phone
            </span>
            {config.contactPhone ? (
              <a
                href={`tel:${config.contactPhone}`}
                className="text-ink transition-colors hover:text-wine"
              >
                {config.contactPhone}
              </a>
            ) : (
              "Pending"
            )}
          </p>
          <p>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-ink/45">
              WhatsApp
            </span>
            {config.whatsapp ? (
              <a
                href={whatsappHref(config.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="text-ink transition-colors hover:text-wine"
              >
                {config.whatsapp}
              </a>
            ) : (
              "Pending"
            )}
          </p>
          <p>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-ink/45">
              Instagram
            </span>
            {instagram ? (
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
                className="text-ink transition-colors hover:text-wine"
              >
                @{instagram}
              </a>
            ) : (
              "Pending"
            )}
          </p>
          <p className="pt-2 text-ink/60">
            Message us any time — we reply on WhatsApp and email as quickly as
            we can.
          </p>
        </div>
        <ContactForm />
      </Container>
    </>
  );
}
