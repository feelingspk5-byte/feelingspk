import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ProductView } from "@/components/catalog/product-view";
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
      `${product.name} — from FEELINGS Elite Men's Collection.`,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ colour?: string }>;
}) {
  const { slug } = await params;
  const { colour } = await searchParams;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.id !== product.id)
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
    [
      "Colours",
      product.colourVariants?.map((c) => c.name).join(" · "),
    ],
    [
      "Lengths",
      product.cutOptions?.map((c) => c.label).join(" · "),
    ],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <Container className="py-10 md:py-14">
      <nav className="mb-6 text-xs uppercase tracking-[0.14em] text-ink/50">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        {product.collectionSlugs[0] ? (
          <>
            <Link
              href={`/collections/${product.collectionSlugs[0]}`}
              className="hover:text-ink"
            >
              {product.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        ) : null}
        <span className="text-ink/70">Buy</span>
      </nav>

      <ProductView product={product} initialColourId={colour} />

      <p className="mt-4 text-sm text-ink/55">
        {availabilityLabel(product.availability)}
      </p>

      <div className="mt-10 max-w-2xl">
        <Disclosure title="Fabric details" defaultOpen>
          {specs.length === 0 ? (
            <p>Details will appear as FEELINGS confirms specifications.</p>
          ) : (
            <dl className="space-y-2">
              {specs.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[140px_1fr] gap-2">
                  <dt className="text-ink/55">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Disclosure>
        <Disclosure title="Delivery">
          Delivery zones, dispatch estimates and charges will be shown from the
          approved FEELINGS shipping policy.
        </Disclosure>
        <Disclosure title="Exchanges & returns">
          Exchange and return eligibility will follow the client-approved policy
          for unstitched fabric.
        </Disclosure>
      </div>

      <section className="mt-16 border-t border-ink/10 pt-12">
        <h2 className="font-display text-3xl text-ink">More collections</h2>
        <div className="mt-6">
          <ProductGrid
            products={related}
            emptyTitle="More fabrics soon"
            emptyDescription="Other unstitched collections appear here."
          />
        </div>
      </section>
    </Container>
  );
}
