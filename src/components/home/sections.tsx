import Link from "next/link";
import { CollectionTile } from "@/components/catalog/collection-tile";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Collection, FabricProduct } from "@/lib/types";

export function ShopByCollection({
  collections,
}: {
  collections: Collection[];
}) {
  if (collections.length === 0) return null;

  return (
    <section className="border-t border-ink/10 bg-stone py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="Browse"
          title="Shop by collection"
          description="Confirmed FEELINGS fabric lines and seasonal edits."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <CollectionTile key={c.id} collection={c} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ProductRail({
  eyebrow,
  title,
  description,
  products,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: FabricProduct[];
  href: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-ink/10 bg-stone py-16 md:py-20">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            className="mb-0"
          />
          <Link
            href={href}
            className="text-sm uppercase tracking-[0.14em] text-wine"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}

export function CatalogueTeaser() {
  return (
    <section className="border-t border-ink/10 bg-stone py-16 md:py-24">
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
              The catalogue
            </p>
            <h2 className="mt-3 max-w-xl font-display text-4xl tracking-tight text-ink md:text-5xl">
              Fabric, presented with restraint.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70 md:text-base">
              Product photography, names, colours and prices will appear here
              once FEELINGS uploads the fabric catalogue. Until then, every
              shopping route is ready — Shop, Collections, and Search.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center rounded-sm bg-ink px-5 text-sm tracking-wide text-ivory"
              >
                Open Shop All
              </Link>
              <Link
                href="/collections"
                className="inline-flex h-11 items-center rounded-sm border border-ink/25 bg-ivory px-5 text-sm tracking-wide text-ink"
              >
                View Collections
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Unstitched only",
                body: "Cloth for shalwar kameez — no ready-made garment sizing.",
              },
              {
                title: "Clear fabric detail",
                body: "Colour, cut length and care once the owner confirms them.",
              },
              {
                title: "Guided ordering",
                body: "Cart and checkout structure prepared for secure fulfilment.",
              },
              {
                title: "House support",
                body: "About, FAQ, shipping and contact pages are already linked.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-sm border border-ink/10 bg-ivory px-5 py-6"
              >
                <p className="font-display text-xl text-ink">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function AboutTeaser() {
  return (
    <section className="border-t border-ink/10 bg-ivory py-16 md:py-24">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
            The house
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
            Why FEELINGS
          </h2>
        </div>
        <div>
          <p className="max-w-xl text-sm leading-relaxed text-ink/70 md:text-base">
            A traditional, refined fabric house for men&apos;s unstitched
            shalwar kameez cloth. Brand story and verified differentiators will
            be published when FEELINGS supplies approved copy — no invented
            heritage claims.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="text-sm uppercase tracking-[0.14em] text-wine"
            >
              About Us
            </Link>
            <Link
              href="/faq"
              className="text-sm uppercase tracking-[0.14em] text-ink/55 hover:text-ink"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-sm uppercase tracking-[0.14em] text-ink/55 hover:text-ink"
            >
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
