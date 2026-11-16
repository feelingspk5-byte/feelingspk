import Link from "next/link";
import { CollectionTile } from "@/components/catalog/collection-tile";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { getCollections, getProductsByCollection } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collections",
  description:
    "Signature FEELINGS fabric collections — open any line to explore its shades.",
};

export default function CollectionsPage() {
  const collections = getCollections();

  const enriched = collections.map((collection) => {
    const product = getProductsByCollection(collection.slug)[0];
    const shades =
      product?.colourVariants
        ?.filter((c) => c.hex)
        .map((c) => ({ name: c.name, hex: c.hex as string })) ?? [];
    return { collection, shades, shadeCount: shades.length };
  });

  return (
    <>
      {/* Typography-led hero — no new imagery */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-stone">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 12% 0%, rgba(107,38,56,0.08), transparent 50%), linear-gradient(180deg, rgba(245,241,233,0.55), transparent 70%)",
          }}
        />
        <Container className="relative py-16 md:py-24">
          <p className="text-[10px] uppercase tracking-[0.32em] text-wine md:text-[11px]">
            Elite Men&apos;s Collection
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Collections
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/70 md:text-base">
            Signature fabric lines for the modern gentleman — open any edit to
            explore its shades. Each cut is sold as 4.5 metres.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-ink/45">
            <span>{collections.length} fabric lines</span>
            <span className="hidden h-3 w-px bg-ink/20 sm:block" aria-hidden />
            <span>Unstitched cloth</span>
            <span className="hidden h-3 w-px bg-ink/20 sm:block" aria-hidden />
            <Link href="/shop" className="text-wine transition-colors hover:text-ink">
              Shop all →
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        {enriched.length === 0 ? (
          <EmptyState
            title="Collections awaiting catalogue"
            description="Upload confirmed collection names and imagery to populate this page."
          />
        ) : (
          <>
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-ink/10 pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                  Browse by line
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  Each collection is a considered palette — tap through to the
                  shade that feels right.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7">
              {enriched.map(({ collection, shades }, index) => (
                <CollectionTile
                  key={collection.id}
                  collection={collection}
                  index={index}
                  shades={shades}
                />
              ))}
            </div>
          </>
        )}
      </Container>

      {/* Soft close CTA */}
      <section className="border-t border-ink/10 bg-ivory">
        <Container className="flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-wine">
              Need a custom length?
            </p>
            <p className="mt-2 font-display text-2xl text-ink md:text-3xl">
              We will cut it for you.
            </p>
            <p className="mt-2 text-sm text-ink/65">
              If your metre option isn&apos;t listed, WhatsApp FEELINGS and we
              will arrange the cloth.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-sm bg-ink px-6 text-sm tracking-wide text-ivory"
            >
              Contact the house
            </Link>
            <Link
              href="/shop?category=unstitched_fabric"
              className="inline-flex h-12 items-center rounded-sm border border-ink px-6 text-sm tracking-wide text-ink"
            >
              Shop fabric
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
