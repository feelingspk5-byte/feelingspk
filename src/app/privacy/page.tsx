import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { PolicyPlaceholder } from "@/components/layout/policy-placeholder";

export const metadata = {
  title: "Privacy Policy",
  description: "FEELINGS privacy and data handling.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy policy" />
      <Container className="py-10 md:py-14">
        <PolicyPlaceholder topic="Privacy policy" />
      </Container>
    </>
  );
}
