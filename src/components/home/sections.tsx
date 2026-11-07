"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/home/motion";
import { Container } from "@/components/layout/container";
import { VectorBackdrop } from "@/components/ui/vector-backdrop";
import {
  demoAssurances,
  demoCollections,
  demoEditorial,
  demoFabrics,
  DEMO_MODE,
} from "@/data/demo-home";
export function DemoPreviewNote() {
  if (!DEMO_MODE) return null;
  return (
    <div className="border-b border-ink/10 bg-ivory/80">
      <Container className="py-2.5 text-center text-[11px] uppercase tracking-[0.16em] text-ink/55">
        Design preview — sample AI imagery & temporary copy. Replace with
        FEELINGS originals later.
      </Container>
    </div>
  );
}

export function FeaturedCollections() {
  return (
    <section className="relative overflow-hidden border-t border-ink/10 bg-stone py-16 md:py-24">
      <VectorBackdrop className="opacity-60" />
      <Container className="relative">
        <FadeIn>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
                Collections
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
                Shop by mood
              </h2>
              <p className="mt-3 max-w-lg text-sm text-ink/65 md:text-base">
                Visual pathways into the house. Final collection names will follow
                the owner catalogue.
              </p>
            </div>
            <Link
              href="/collections"
              className="text-sm uppercase tracking-[0.14em] text-wine"
            >
              View all
            </Link>
          </div>
        </FadeIn>

        <Stagger className="grid gap-4 md:grid-cols-3">
          {demoCollections.map((item, index) => (
            <StaggerItem key={item.slug}>
              <Link
                href="/collections"
                className="group relative block overflow-hidden rounded-sm bg-ivory"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`${item.name} fabric sample`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width:768px) 100vw, 33vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                  <p className="font-display text-2xl">{item.name}</p>
                  <p className="mt-1 text-sm text-ivory/75">{item.detail}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function FeaturedFabrics() {
  return (
    <section className="relative border-t border-ink/10 bg-ivory py-16 md:py-24">
      <Container>
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
              Featured fabrics
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
              Texture first.
            </h2>
            <p className="mt-3 text-sm text-ink/65 md:text-base">
              Sample fabric studies for homepage layout. Prices and SKUs stay
              empty until FEELINGS uploads the real catalogue.
            </p>
          </div>
        </FadeIn>

        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {demoFabrics.map((fabric) => (
            <StaggerItem key={fabric.slug}>
              <Link
                href="/shop"
                className="group block overflow-hidden rounded-sm bg-stone/40 transition-transform duration-feel hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={fabric.image}
                    alt={`${fabric.name} sample fabric`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-ivory/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink/70">
                    {fabric.tag}
                  </span>
                </div>
                <div className="px-3 py-3">
                  <p className="text-sm font-medium text-ink group-hover:text-wine">
                    {fabric.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/55">{fabric.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-ink/40">
                    Price pending
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function EditorialBand() {
  return (
    <section className="relative overflow-hidden border-t border-ink/10 bg-ink text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[22rem] lg:min-h-[32rem]">
          <Image
            src={demoEditorial.image}
            alt="Draped fabric editorial sample"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>
        <div className="relative flex items-center px-6 py-14 md:px-12 md:py-20">
          <VectorBackdrop variant="ink" className="opacity-70" />
          <FadeIn className="relative max-w-md">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {demoEditorial.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
              {demoEditorial.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70 md:text-base">
              {demoEditorial.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex h-11 items-center rounded-sm bg-ivory px-5 text-sm tracking-wide text-ink"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-sm border border-ivory/35 px-5 text-sm tracking-wide text-ivory"
              >
                Contact
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function AssuranceRow() {
  return (
    <section className="border-t border-ink/10 bg-stone py-14 md:py-16">
      <Container>
        <Stagger className="grid gap-4 md:grid-cols-3">
          {demoAssurances.map((item) => (
            <StaggerItem key={item.title}>
              <div className="rounded-sm border border-ink/10 bg-ivory/70 px-5 py-7">
                <div className="mb-4 h-px w-10 bg-wine" />
                <p className="font-display text-2xl text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {item.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

