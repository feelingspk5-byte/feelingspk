import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { PolicyPlaceholder } from "@/components/layout/policy-placeholder";

export const metadata = {
  title: "Shipping",
  description: "FEELINGS delivery information.",
};

export default function ShippingPage() {
  return (
    <>
      <PageHeader
        title="Shipping"
        description="Delivery zones, dispatch estimates, charges and tracking — from approved policy only."
      />
      <Container className="py-10 md:py-14">
        <PolicyPlaceholder topic="Shipping policy" />
      </Container>
    </>
  );
}
