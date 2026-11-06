import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { PolicyPlaceholder } from "@/components/layout/policy-placeholder";

export const metadata = {
  title: "Terms of Service",
  description: "FEELINGS terms of service.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of service" />
      <Container className="py-10 md:py-14">
        <PolicyPlaceholder topic="Terms of service" />
      </Container>
    </>
  );
}
