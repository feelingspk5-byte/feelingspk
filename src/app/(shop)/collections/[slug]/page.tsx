import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import {
  getCollectionBySlug,
  getProductsByCollection,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

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
      <section className="relative overflow-hidden border-b border-ink/10 bg-stone">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 85% 10%, rgba(107,38,56,0.07), transparent 45%)",
          }}
        />
        <Container className="relative py-12 md:py-16">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink/45">
            <Link href="/collections" className="hover:text-wine">
              Collections
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink/70">{collection.name}</span>
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-wine">
            Fabric line
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">
            {collection.name}
          </h1>
          {collection.description ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 md:text-base">
              {collection.description}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.16em] text-ink/45">
            <span>
              {colours.length} shade{colours.length === 1 ? "" : "s"}
            </span>
            {product ? (
              <Link
                href={`/products/${product.slug}`}
                className="text-wine hover:text-ink"
              >
                Shop this collection →
              </Link>
            ) : null}
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14">
          <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
            {collection.imageSrc ? (
              <Image
                src={collection.imageSrc}
                alt={collection.name}
                fill
                quality={92}
                className="object-cover object-center"
                sizes="(max-width:1024px) 100vw, 45vw"
                priority
              />
            ) : null}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
              The palette
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              Choose a shade
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/65">
              Open any colour to see the cloth up close, select your length, and
              continue. Custom metres are available on WhatsApp.
            </p>

            {product && colours.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2">
                {colours.map((colour) => {
                  const imageId = colour.imageIds?.[0];
                  const image = product.images.find((img) => img.id === imageId);
                  return (
                    <Link
                      key={colour.id}
                      href={`/products/${product.slug}?colour=${colour.id}`}
                      className="group overflow-hidden border border-ink/10 bg-ivory transition-transform duration-feel hover:-translate-y-0.5 hover:border-wine/40"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
                        {image?.src ? (
                          <Image
                            src={image.src}
                            alt={colour.name}
                            fill
                            quality={92}
                            sizes="(max-width:768px) 50vw, 20vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{
                              backgroundColor: colour.hex ?? "#d8d1c6",
                            }}
                          />
                        )}
                      </div>
                      <div className="flex items-start gap-3 border-t border-ink/10 px-3 py-3">
                        <span
                          className="mt-0.5 h-5 w-5 shrink-0 rounded-sm border border-ink/10"
                          style={{
                            backgroundColor: colour.hex ?? "#d8d1c6",
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium leading-snug text-ink group-hover:text-wine">
                            {colour.name}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink/45">
                            View shade
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="mt-8 text-sm text-ink/60">
                Shades for this collection will appear when linked in the
                catalogue.
              </p>
            )}

            {colours.length > 0 ? (
              <div className="mt-8 flex h-2 overflow-hidden border border-ink/10">
                {colours.map((colour) => (
                  <span
                    key={colour.id}
                    className="flex-1"
                    style={{ backgroundColor: colour.hex ?? "#d8d1c6" }}
                    title={colour.name}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/collections"
            className="text-sm tracking-wide text-ink/60 transition-colors hover:text-wine"
          >
            ← All collections
          </Link>
          {product ? (
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm tracking-wide text-ivory"
            >
              Shop {collection.name}
            </Link>
          ) : null}
        </div>
      </Container>
    </>
  );
}
