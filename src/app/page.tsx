import { HomeHero } from "@/components/home/hero";
import { NewsletterSignup } from "@/components/home/newsletter";
import {
  AssuranceRow,
  DemoPreviewNote,
  EditorialBand,
  FeaturedCollections,
  FeaturedFabrics,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <DemoPreviewNote />
      <HomeHero />
      <FeaturedCollections />
      <FeaturedFabrics />
      <EditorialBand />
      <AssuranceRow />
      <NewsletterSignup />
    </>
  );
}
