import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Disclosure } from "@/components/ui/disclosure";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "FAQ",
  description: "FEELINGS fabric shopping questions.",
};

const structuralTopics = [
  "Fabric details",
  "Quantity / cut length",
  "Delivery",
  "Payment",
  "Orders",
  "Exchanges & returns",
  "Care",
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="FAQ"
        description="Answers will use FEELINGS-approved information only."
      />
      <Container className="max-w-3xl space-y-2 py-10 md:py-14">
        <EmptyState
          className="mb-8"
          title="FAQ copy pending"
          description="Topic structure is prepared. Detailed answers will be filled when FEELINGS supplies them."
        />
        {structuralTopics.map((topic) => (
          <Disclosure key={topic} title={topic}>
            Answer pending owner approval for “{topic}”. No assumed policies are
            shown.
          </Disclosure>
        ))}
      </Container>
    </>
  );
}
