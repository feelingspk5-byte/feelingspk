import { HomeHero } from "@/components/home/hero";
import { NewsletterSignup } from "@/components/home/newsletter";
import {
  AboutTeaser,
  CatalogueTeaser,
  ProductRail,
  ShopByCollection,
} from "@/components/home/sections";
import {
  getBestSellers,
  getCollections,
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/catalog";

export default function HomePage() {
  const collections = getCollections();
  const newArrivals = getNewArrivals();
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellers();
  const hasCatalogue =
    collections.length > 0 ||
    newArrivals.length > 0 ||
    featured.length > 0 ||
    bestSellers.length > 0;

  return (
    <>
      <HomeHero />
      <ShopByCollection collections={collections} />
      <ProductRail
        eyebrow="Just in"
        title="New arrivals"
        description="Newest FEELINGS fabrics."
        products={newArrivals}
        href="/shop?filter=new"
      />
      <ProductRail
        eyebrow="Curated"
        title="Featured collection"
        description="A curated fabric edit from the house."
        products={featured}
        href="/shop"
      />
      <ProductRail
        eyebrow="Favourites"
        title="Best sellers"
        description="Confirmed favourites from FEELINGS."
        products={bestSellers}
        href="/shop"
      />
      {!hasCatalogue ? <CatalogueTeaser /> : null}
      <AboutTeaser />
      <NewsletterSignup />
    </>
  );
}
