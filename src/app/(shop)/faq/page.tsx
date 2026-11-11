import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Disclosure } from "@/components/ui/disclosure";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "FAQ",
  description: "FEELINGS Elite Men's Collection — shopping questions.",
};

const structuralTopics = [
  "Products & categories",
  "Fabric & shades",
  "Sizing (shalwar kameez & shirts)",
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
        description="Clear answers for shopping the Elite Men's Collection."
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
