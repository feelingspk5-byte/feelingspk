import { Container } from "@/components/layout/container";

export default function RootLoading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-ink/10 bg-ivory/60 px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto h-8 w-48 rounded-sm bg-ink/10" />
        <div className="mx-auto mt-4 h-4 w-80 max-w-full rounded-sm bg-ink/10" />
      </div>
      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-sm bg-ivory">
              <div className="aspect-[4/5] bg-ink/10" />
              <div className="space-y-2 border-t border-ink/10 px-4 py-4">
                <div className="h-5 w-2/3 rounded-sm bg-ink/10" />
                <div className="h-3 w-full rounded-sm bg-ink/10" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
