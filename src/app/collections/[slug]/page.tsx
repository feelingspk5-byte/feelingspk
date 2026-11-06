import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/catalog/product-grid";
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
      `${collection.name} unstitched fabrics from FEELINGS.`,
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

  return (
    <>
      <PageHeader
        title={collection.name}
        description={
          collection.description ??
          "Fabrics in this collection appear when linked in the FEELINGS catalogue."
        }
      />
      <Container className="py-10 md:py-14">
        <ProductGrid
          products={products}
          emptyTitle="No fabrics in this collection yet"
          emptyDescription="Associate products with this collection slug when uploading the catalogue."
        />
      </Container>
    </>
  );
}
