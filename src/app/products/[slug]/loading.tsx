import { Container } from "@/components/layout/container";

export default function ProductLoading() {
  return (
    <Container className="animate-pulse py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square rounded-sm bg-ink/10" />
        <div className="space-y-4">
          <div className="h-3 w-40 rounded-sm bg-ink/10" />
          <div className="h-10 w-3/4 rounded-sm bg-ink/10" />
          <div className="h-4 w-full rounded-sm bg-ink/10" />
          <div className="h-4 w-5/6 rounded-sm bg-ink/10" />
          <div className="mt-8 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-sm border border-ink/10">
                <div className="h-14 bg-ink/10" />
                <div className="h-10 bg-ivory" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
