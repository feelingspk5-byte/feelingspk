import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "About Us",
  description: "About FEELINGS — Elite Men's Collection.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About FEELINGS"
        description="Traditional, refined and product-focused. Approved brand story only — no invented heritage."
      />
      <Container className="space-y-8 py-10 md:py-14">
        <p className="max-w-2xl text-base leading-relaxed text-ink/80">
          FEELINGS is an Elite Men&apos;s Collection house offering unstitched
          fabric for custom stitching, ready stitched shalwar kameez in sizes,
          and dress shirts. Detailed founding history will appear when FEELINGS
          supplies approved copy.
        </p>
        <EmptyState
          title="Brand story pending approval"
          description="Founding history, values and product philosophy will be published when FEELINGS provides approved copy. Unsupported claims are intentionally omitted."
        />
      </Container>
    </>
  );
}
