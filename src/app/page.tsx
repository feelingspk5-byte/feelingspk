import { HomeHero } from "@/components/home/hero";
import { NewsletterSignup } from "@/components/home/newsletter";
import {
  AssuranceRow,
  EditorialBand,
  FeaturedCollections,
  FeaturedFabrics,
  ShopCategories,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
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
