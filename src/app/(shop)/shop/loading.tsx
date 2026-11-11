import { Container } from "@/components/layout/container";

export default function ShopLoading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-ink/10 bg-ivory/70 px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto h-9 w-40 rounded-sm bg-ink/10" />
        <div className="mx-auto mt-4 h-4 w-72 max-w-full rounded-sm bg-ink/10" />
      </div>
      <Container className="py-10 md:py-14">
        <div className="mb-8 h-11 w-full max-w-xl rounded-sm bg-ink/10" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-sm bg-ivory p-3">
              <div className="aspect-[3/4] rounded-sm bg-ink/10" />
              <div className="mt-3 h-4 w-3/4 rounded-sm bg-ink/10" />
              <div className="mt-2 h-3 w-1/2 rounded-sm bg-ink/10" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
