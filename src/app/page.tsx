import { HomeHero } from "@/components/home/hero";
import { NewsletterSignup } from "@/components/home/newsletter";
import {
  AssuranceRow,
  DemoPreviewNote,
  EditorialBand,
  FeaturedCollections,
  FeaturedFabrics,
  ShopCategories,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <DemoPreviewNote />
      <HomeHero />
      <ShopCategories />
      <FeaturedCollections />
      <FeaturedFabrics />
      <EditorialBand />
      <AssuranceRow />
      <NewsletterSignup />
    </>
  );
}
