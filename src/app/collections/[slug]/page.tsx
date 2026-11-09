import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import {
  getCollectionBySlug,
  getCollections,
  getProductsByCollection,
} from "@/lib/catalog";

export function generateStaticParams() {
  return getCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection" };
  return {
    title: collection.name,
    description:
      collection.description ??
      `${collection.name} from FEELINGS Elite Men's Collection.`,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getProductsByCollection(slug);
  const product = products[0];
  const colours = product?.colourVariants ?? [];

  return (
    <>
      <PageHeader
        title={collection.name}
        description={
          collection.description ??
          "A FEELINGS Elite Men's Collection line."
        }
      />
      <Container className="py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ivory">
            {collection.imageSrc ? (
              <Image
                src={collection.imageSrc}
                alt={collection.name}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
            ) : null}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-wine">
              Collection
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              {colours.length} shade
              {colours.length === 1 ? "" : "s"} in this line
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Open a shade to see the cloth up close and continue to purchase
              options. Move between colours on the product page.
            </p>
            {product ? (
              <div className="mt-6">
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-ink/90"
                >
                  Shop this collection
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
                Shades
              </p>
              <h3 className="mt-2 font-display text-3xl text-ink">
                Choose a shade
              </h3>
            </div>
          </div>

          {product && colours.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {colours.map((colour) => {
                const imageId = colour.imageIds?.[0];
                const image = product.images.find((img) => img.id === imageId);
                return (
                  <Link
                    key={colour.id}
                    href={`/products/${product.slug}?colour=${colour.id}`}
                    className="group block overflow-hidden rounded-sm bg-ivory transition-transform duration-feel hover:-translate-y-1"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone/40">
                      {image?.src ? (
                        <Image
                          src={image.src}
                          alt={colour.name}
                          fill
                          sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ backgroundColor: colour.hex ?? "#d8d1c6" }}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3 px-3 py-3">
                      <span
                        className="h-4 w-4 shrink-0 rounded-sm border border-ink/10"
                        style={{ backgroundColor: colour.hex ?? "#d8d1c6" }}
                      />
                      <div>
                        <p className="text-sm font-medium text-ink group-hover:text-wine">
                          {colour.name}
                        </p>
                        <p className="text-xs text-ink/50">View shade</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-ink/60">
              Shades for this collection will appear when linked in the
              catalogue.
            </p>
          )}
        </section>
      </Container>
    </>
  );
}
