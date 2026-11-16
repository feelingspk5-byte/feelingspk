import { HomeHero } from "@/components/home/hero";
import { LaunchOfferPopup } from "@/components/home/launch-offer-popup";
import { NewsletterSignup } from "@/components/home/newsletter";
import {
  AssuranceRow,
  EditorialBand,
  FeaturedCollections,
  FeaturedFabrics,
  ShopCategories,
} from "@/components/home/sections";
import { getCms } from "@/lib/catalog";
import {
  getHomeAssurances,
  getHomeCategories,
  getHomeCollections,
  getHomeEditorial,
  getHomeFabrics,
  getLaunchOfferContent,
} from "@/lib/home-content";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const cms = getCms();
  const categories = getHomeCategories();
  const collections = getHomeCollections();
  const fabrics = getHomeFabrics();
  const editorial = getHomeEditorial();
  const assurances = getHomeAssurances();
  const launchOffer = getLaunchOfferContent();

  return (
    <>
      <HomeHero content={cms.hero} />
      <ShopCategories items={categories} />
      <FeaturedCollections items={collections} />
      <FeaturedFabrics items={fabrics} />
      <EditorialBand content={editorial} />
      <AssuranceRow items={assurances} />
      <NewsletterSignup />
      <LaunchOfferPopup offer={launchOffer} />
    </>
  );
}
