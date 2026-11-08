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
    "Browse FEELINGS unstitched fabric collections — choose colour and length (1m, 2m, 4m, 6m).",
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

  const category = searchParams.category;
  const comingSoon =
    category === "stitched_shalwar_kameez"
      ? {
          title: "Stitched Shalwar Kameez — Coming soon",
          description:
            "Sized ready-to-wear suits are being prepared for the Elite Men's Collection. Explore unstitched fabric while you wait.",
        }
      : category === "dress_shirt"
        ? {
            title: "Dress Shirts — Coming soon",
            description:
              "Formal shirt styles are on the way. Browse unstitched fabric collections in the meantime.",
          }
        : {
            title: "The collection is being arranged",
            description:
              "Unstitched fabric is live now. Stitched shalwar kameez and dress shirts are coming soon.",
          };

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
        emptyTitle={comingSoon.title}
        emptyDescription={comingSoon.description}
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
        description="Elite Men's Collection — unstitched fabric is available now. Stitched shalwar kameez and dress shirts are coming soon."
      />
      <Container className="py-10 md:py-14">
        <Suspense fallback={<p className="text-sm text-ink/60">Loading shop…</p>}>
          <ShopContent searchParams={params} />
        </Suspense>
      </Container>
    </>
  );
}
