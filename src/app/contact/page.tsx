import { ContactForm } from "@/components/home/contact-form";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getSiteConfig } from "@/lib/catalog";

export const metadata = {
  title: "Contact",
  description: "Contact FEELINGS for fabric orders and support.",
};

export default function ContactPage() {
  const config = getSiteConfig();

  return (
    <>
      <PageHeader
        title="Contact"
        description="Reach FEELINGS once official email, phone or WhatsApp details are confirmed."
      />
      <Container className="grid gap-10 py-10 md:grid-cols-2 md:py-14">
        <div className="space-y-4 text-sm text-ink/75">
          <p>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-ink/45">
              Email
            </span>
            {config.contactEmail ?? "Pending owner confirmation"}
          </p>
          <p>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-ink/45">
              Phone / WhatsApp
            </span>
            {config.contactPhone ??
              config.whatsapp ??
              "Pending owner confirmation"}
          </p>
          <p className="pt-2 text-ink/60">
            Response expectations will be published with the approved support
            details. The form below is ready for integration.
          </p>
        </div>
        <ContactForm />
      </Container>
    </>
  );
}
