import Link from "next/link";
import { CollectionTile } from "@/components/catalog/collection-tile";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Collection, FabricProduct } from "@/lib/types";

export function ShopByCollection({
  collections,
}: {
  collections: Collection[];
}) {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="Browse"
          title="Shop by collection"
          description="Collection tiles appear from confirmed FEELINGS catalogue categories only."
        />
        {collections.length === 0 ? (
          <EmptyState
            title="Collections pending catalogue"
            description="When FEELINGS confirms fabric lines or seasonal edits, they will be listed here with approved imagery."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <CollectionTile key={c.id} collection={c} />
            ))}
          </div>
        )}
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
  emptyTitle,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: FabricProduct[];
  href: string;
  emptyTitle: string;
}) {
  return (
    <section className="border-t border-ink/10 py-16 md:py-20">
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
        <ProductGrid
          products={products}
          emptyTitle={emptyTitle}
          emptyDescription="Placeholder products are intentionally omitted. Upload catalogue data to populate this section."
        />
      </Container>
    </section>
  );
}

export function WhyFeelings() {
  return (
    <section className="border-t border-ink/10 bg-ivory/50 py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="The house"
          title="Why FEELINGS"
          description="Brand story, fabric quality notes and service differentiators will appear here once FEELINGS supplies approved copy. No unverified claims are shown."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {["Heritage presentation", "Fabric clarity", "Considered service"].map(
            (label) => (
              <div
                key={label}
                className="rounded-sm border border-dashed border-ink/15 bg-stone/40 px-5 py-8"
              >
                <p className="font-display text-xl text-ink">{label}</p>
                <p className="mt-2 text-sm text-ink/60">
                  Content pending owner approval.
                </p>
              </div>
            ),
          )}
        </div>
        <Link
          href="/about"
          className="mt-8 inline-flex text-sm uppercase tracking-[0.14em] text-wine"
        >
          About FEELINGS
        </Link>
      </Container>
    </section>
  );
}

export function FeedbackPending() {
  return (
    <section className="border-t border-ink/10 py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="Voices"
          title="Customer feedback"
          description="Only real reviews published with permission will appear here."
        />
        <EmptyState
          title="No approved reviews yet"
          description="Customer feedback will be added when FEELINGS provides permissioned testimonials."
        />
      </Container>
    </section>
  );
}

export function EditorialPending() {
  return (
    <section className="border-t border-ink/10 py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="Studio"
          title="Editorial & social"
          description="Approved brand or product imagery from FEELINGS channels will be featured here."
        />
        <EmptyState
          title="Editorial imagery pending"
          description="Social and campaign assets will be connected after the owner supplies approved media."
        />
      </Container>
    </section>
  );
}

