import Link from "next/link";
import { Container } from "@/components/layout/container";
import { FabricPlaceholder } from "@/components/ui/fabric-placeholder";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="absolute inset-0">
        <FabricPlaceholder
          aspect="hero"
          label="Campaign fabric photography pending"
          className="h-full min-h-[70vh] rounded-none border-0 aspect-auto"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-stone via-stone/55 to-stone/20" />

      <Container className="relative flex min-h-[70vh] flex-col justify-end pb-14 pt-28 md:pb-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
          Men&apos;s unstitched fabric
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-ink text-balance md:text-6xl lg:text-7xl">
          FEELINGS
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink/75 md:text-lg">
          Traditional Pakistani luxury for shalwar kameez cloth. Discover fabric
          collections once the FEELINGS catalogue is uploaded.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/collections"
            className="inline-flex h-12 items-center rounded-sm bg-ink px-6 text-sm tracking-wide text-ivory transition-colors duration-feel hover:bg-ink/90"
          >
            Shop Collection
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-12 items-center rounded-sm border border-ink px-6 text-sm tracking-wide text-ink transition-colors duration-feel hover:bg-ink hover:text-ivory"
          >
            Shop All Fabrics
          </Link>
        </div>
      </Container>
    </section>
  );
}
