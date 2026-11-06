import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "About Us",
  description: "About FEELINGS — men's unstitched fabric house.",
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
          FEELINGS sells men&apos;s unstitched shalwar kameez fabric. Customers
          purchase cloth and arrange stitching separately unless FEELINGS
          explicitly confirms a stitching service.
        </p>
        <EmptyState
          title="Brand story pending approval"
          description="Founding history, values and fabric philosophy will be published when FEELINGS provides approved copy. Unsupported claims are intentionally omitted."
        />
      </Container>
    </>
  );
}
