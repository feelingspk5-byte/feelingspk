import { Container } from "@/components/layout/container";

export default function CollectionLoading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-ink/10 bg-ivory/70 px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto h-9 w-64 rounded-sm bg-ink/10" />
        <div className="mx-auto mt-4 h-4 w-80 max-w-full rounded-sm bg-ink/10" />
      </div>
      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-sm bg-ivory">
              <div className="aspect-[3/4] bg-ink/10" />
              <div className="h-12 border-t border-ink/10 px-3 py-3">
                <div className="h-4 w-2/3 rounded-sm bg-ink/10" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
