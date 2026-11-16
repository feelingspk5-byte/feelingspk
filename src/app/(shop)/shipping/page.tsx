import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { formatPrice } from "@/lib/format";
import { getShippingZones, getSiteConfig } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shipping",
  description: "FEELINGS delivery zones and charges.",
};

export default function ShippingPage() {
  const zones = getShippingZones().filter((z) => z.active);
  const config = getSiteConfig();
  const currency = config.currencyPlaceholder || "PKR";

  return (
    <>
      <PageHeader
        title="Shipping"
        description="Delivery zones and charges from the FEELINGS house — updated from store settings."
      />
      <Container className="py-10 md:py-14">
        {zones.length === 0 ? (
          <p className="max-w-xl text-sm leading-relaxed text-ink/70">
            Shipping rates are confirmed on your Cash on Delivery order call.
            Nationwide delivery is available across Pakistan.
          </p>
        ) : (
          <div className="overflow-hidden rounded-sm border border-ink/10 bg-ivory">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink/10 bg-stone/50 text-[11px] uppercase tracking-[0.14em] text-ink/55">
                <tr>
                  <th className="px-4 py-3 font-medium">Zone</th>
                  <th className="px-4 py-3 font-medium">Cities</th>
                  <th className="px-4 py-3 font-medium">Rate</th>
                  <th className="px-4 py-3 font-medium">Free above</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {zones.map((zone) => (
                  <tr key={zone.id}>
                    <td className="px-4 py-3.5 font-medium text-ink">
                      {zone.name}
                    </td>
                    <td className="px-4 py-3.5 text-ink/70">
                      {zone.cities.includes("*")
                        ? "All cities"
                        : zone.cities.join(", ")}
                    </td>
                    <td className="px-4 py-3.5 text-ink">
                      {formatPrice(zone.rate, currency)}
                    </td>
                    <td className="px-4 py-3.5 text-ink/70">
                      {zone.freeAbove !== undefined
                        ? formatPrice(zone.freeAbove, currency)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-6 max-w-xl text-sm text-ink/60">
          Final shipping is confirmed when we call to verify your Cash on
          Delivery order
          {config.whatsapp ? (
            <>
              {" "}
              — WhatsApp{" "}
              <a
                href={`https://wa.me/${config.whatsapp.replace(/\D/g, "").replace(/^0/, "92")}`}
                className="text-wine underline-offset-2 hover:underline"
              >
                {config.whatsapp}
              </a>
            </>
          ) : null}
          .
        </p>
      </Container>
    </>
  );
}
