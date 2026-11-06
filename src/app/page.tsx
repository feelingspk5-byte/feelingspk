import { HomeHero } from "@/components/home/hero";
import { NewsletterSignup } from "@/components/home/newsletter";
import {
  EditorialPending,
  FeedbackPending,
  ProductRail,
  ShopByCollection,
  WhyFeelings,
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

  return (
    <>
      <HomeHero />
      <ShopByCollection collections={collections} />
      <ProductRail
        eyebrow="Just in"
        title="New arrivals"
        description="Newest FEELINGS fabrics once the owner marks them in the catalogue."
        products={newArrivals}
        href="/shop?filter=new"
        emptyTitle="New arrivals pending catalogue"
      />
      <ProductRail
        eyebrow="Curated"
        title="Featured collection"
        description="A curated fabric edit with premium presentation — populated from confirmed featured products."
        products={featured}
        href="/shop"
        emptyTitle="Featured fabrics pending"
      />
      <WhyFeelings />
      <ProductRail
        eyebrow="Favourites"
        title="Best sellers"
        description="Shown only when FEELINGS confirms sales data or approved featured products."
        products={bestSellers}
        href="/shop"
        emptyTitle="Best sellers pending confirmation"
      />
      <FeedbackPending />
      <EditorialPending />
      <NewsletterSignup />
    </>
  );
}
