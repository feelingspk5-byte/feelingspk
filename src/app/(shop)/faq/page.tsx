import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Disclosure } from "@/components/ui/disclosure";
import { EmptyState } from "@/components/ui/empty-state";
import { getCms } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAQ",
  description: "FEELINGS Elite Men's Collection — shopping questions.",
};

export default function FaqPage() {
  const faq = getCms().faq.filter((item) => item.question.trim());

  return (
    <>
      <PageHeader
        title="FAQ"
        description="Clear answers for shopping the Elite Men's Collection."
      />
      <Container className="max-w-3xl space-y-2 py-10 md:py-14">
        {faq.length === 0 ? (
          <EmptyState
            title="FAQ coming soon"
            description="Questions will appear here once FEELINGS adds them in admin."
          />
        ) : (
          faq.map((item) => (
            <Disclosure key={item.question} title={item.question}>
              {item.answer}
            </Disclosure>
          ))
        )}
      </Container>
    </>
  );
}
