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

export const dynamic = "force-dynamic";

export default function HomePage() {
  const cms = getCms();

  return (
    <>
      <HomeHero content={cms.hero} />
      <ShopCategories />
      <FeaturedCollections />
      <FeaturedFabrics />
      <EditorialBand />
      <AssuranceRow />
      <NewsletterSignup />
      <LaunchOfferPopup />
    </>
  );
}
