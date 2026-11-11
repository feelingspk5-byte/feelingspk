import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { PolicyPlaceholder } from "@/components/layout/policy-placeholder";

export const metadata = {
  title: "Exchanges & Returns",
  description: "FEELINGS fabric exchange and return policy.",
};

export default function ExchangesPage() {
  return (
    <>
      <PageHeader
        title="Exchanges & returns"
        description="Eligibility, timeframe, condition and process — published after client approval."
      />
      <Container className="py-10 md:py-14">
        <PolicyPlaceholder topic="Exchange / return policy" />
      </Container>
    </>
  );
}
