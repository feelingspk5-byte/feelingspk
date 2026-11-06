import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductPurchase } from "@/components/catalog/product-purchase";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Container } from "@/components/layout/container";
import { Disclosure } from "@/components/ui/disclosure";
import {
  availabilityLabel,
  getProductBySlug,
  getProducts,
} from "@/lib/catalog";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Fabric" };
  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} — men's unstitched fabric from FEELINGS.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getProducts()
    .filter(
      (p) =>
        p.id !== product.id &&
        p.collectionSlugs.some((c) => product.collectionSlugs.includes(c)),
    )
    .slice(0, 4);

  const specs = [
    ["SKU", product.sku],
    ["Fabric type", product.fabricType],
    ["Composition", product.composition],
    ["Weave", product.weave],
    ["Finish", product.finish],
    ["Season / use", product.season],
    ["Width", product.width],
    ["Care", product.care],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <Container className="py-10 md:py-14">
      <nav className="mb-6 text-xs uppercase tracking-[0.14em] text-ink/50">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-wine">
            Unstitched fabric
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            {availabilityLabel(product.availability)}
          </p>
          {product.description ? (
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              {product.description}
            </p>
          ) : (
            <p className="mt-4 text-sm text-ink/60">
              Product description pending FEELINGS catalogue copy.
            </p>
          )}

          {product.includesNote ? (
            <p className="mt-4 rounded-sm border border-ink/10 bg-ivory px-3 py-2 text-sm text-ink/75">
              Includes: {product.includesNote}
            </p>
          ) : null}

          <div className="mt-8">
            <ProductPurchase product={product} />
          </div>

          <div className="mt-10">
            <Disclosure title="Fabric details" defaultOpen>
              {specs.length === 0 ? (
                <p>
                  Composition, weave, finish, width and care will appear when
                  FEELINGS supplies verified specifications. Nothing is invented
                  here.
                </p>
              ) : (
                <dl className="space-y-2">
                  {specs.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[140px_1fr] gap-2"
                    >
                      <dt className="text-ink/55">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </Disclosure>
            <Disclosure title="Delivery">
              Delivery zones, dispatch estimates and charges will be shown from
              the approved FEELINGS shipping policy. See the Shipping page once
              published.
            </Disclosure>
            <Disclosure title="Exchanges & returns">
              Exchange and return eligibility for unstitched fabric will follow
              the client-approved policy. No timeframe or conditions are assumed
              here.
            </Disclosure>
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-ink/10 pt-12">
        <h2 className="font-display text-3xl text-ink">Related fabrics</h2>
        <div className="mt-6">
          <ProductGrid
            products={related}
            emptyTitle="Related fabrics unavailable"
            emptyDescription="Related items appear when other products share a confirmed collection."
          />
        </div>
      </section>
    </Container>
  );
}
