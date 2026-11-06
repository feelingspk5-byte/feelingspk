import { Container } from "@/components/layout/container";

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-ink/10 bg-stone-soft/40">
      <Container className="py-12 md:py-16">
        <h1 className="font-display text-4xl tracking-tight text-ink md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm text-ink/70 md:text-base">
            {description}
          </p>
        ) : null}
      </Container>
    </div>
  );
}
