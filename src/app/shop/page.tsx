import { Suspense } from "react";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ShopToolbar } from "@/components/catalog/shop-toolbar";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import {
  getCollections,
  getProducts,
  searchProducts,
} from "@/lib/catalog";
import type { Product, ProductCategory } from "@/lib/types";

export const metadata = {
  title: "Shop All",
  description:
    "Browse FEELINGS Elite Men's Collection — unstitched fabric, stitched shalwar kameez, and dress shirts.",
};

function sortProducts(list: Product[], sort: string) {
  const next = [...list];
  switch (sort) {
    case "newest":
      return next.reverse();
    case "price-asc":
      return next.sort(
        (a, b) =>
          (a.price ?? Number.POSITIVE_INFINITY) -
          (b.price ?? Number.POSITIVE_INFINITY),
      );
    case "price-desc":
      return next.sort(
        (a, b) =>
          (b.price ?? Number.NEGATIVE_INFINITY) -
          (a.price ?? Number.NEGATIVE_INFINITY),
      );
    default:
      return next;
  }
}

function ShopContent({
  searchParams,
}: {
  searchParams: {
    q?: string;
    sort?: string;
    collection?: string;
    filter?: string;
    category?: string;
  };
}) {
  const collections = getCollections();
  let products = searchParams.q
    ? searchProducts(searchParams.q)
    : getProducts();

  if (searchParams.category) {
    products = products.filter(
      (p) => p.category === (searchParams.category as ProductCategory),
    );
  }
  if (searchParams.collection) {
    products = products.filter((p) =>
      p.collectionSlugs.includes(searchParams.collection!),
    );
  }
  if (searchParams.filter === "new") {
    products = products.filter((p) => p.newArrival);
  }

  products = sortProducts(products, searchParams.sort ?? "featured");

  return (
    <>
      <ShopToolbar
        resultCount={products.length}
        availableCollections={collections.map((c) => ({
          slug: c.slug,
          name: c.name,
        }))}
      />
      <ProductGrid
        products={products}
        emptyTitle="Catalogue pending upload"
        emptyDescription="FEELINGS products will appear here once the owner supplies unstitched fabric, stitched shalwar kameez, and dress shirt listings."
      />
    </>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    collection?: string;
    filter?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader
        title="Shop the collection"
        description="Elite Men's Collection — unstitched fabric, stitched shalwar kameez with sizes, and dress shirts. Filters update as the catalogue is uploaded."
      />
      <Container className="py-10 md:py-14">
        <Suspense fallback={<p className="text-sm text-ink/60">Loading shop…</p>}>
          <ShopContent searchParams={params} />
        </Suspense>
      </Container>
    </>
  );
}
