"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/home/motion";
import { Container } from "@/components/layout/container";
import { VectorBackdrop } from "@/components/ui/vector-backdrop";
import {
  demoAssurances,
  demoCategories,
  demoCollections,
  demoEditorial,
  demoFabrics,
} from "@/data/demo-home";

export function ShopCategories() {
  return (
    <section className="relative overflow-hidden border-t border-ink/10 bg-stone py-16 md:py-24">
      <VectorBackdrop className="opacity-50" />
      <Container className="relative">
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
              Categories
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
              Shop the house
            </h2>
            <p className="mt-3 text-sm text-ink/65 md:text-base">
              Shop the way premium menswear houses do — by category. Unstitched
              fabric, stitched shalwar kameez, and dress shirts, each with its
              own path.
            </p>
          </div>
        </FadeIn>
        <Stagger className="grid items-stretch gap-4 md:grid-cols-3">
          {demoCategories.map((item, index) => (
            <StaggerItem key={item.slug} className="h-full">
              <Link
                href={item.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-sm bg-ivory"
              >
                <div className="relative aspect-[3/4] shrink-0 overflow-hidden bg-stone/25">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width:768px) 100vw, 33vw"
                    priority={index === 0}
                  />
                  {"badge" in item && item.badge ? (
                    <span className="absolute left-4 top-4 rounded-sm bg-ivory/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ink">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <div className="flex min-h-[6.75rem] flex-1 flex-col border-t border-ink/10 px-5 py-5">
                  <p className="font-display text-2xl text-ink">{item.name}</p>
                  <p className="mt-1 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-ink/65">
                    {item.detail}
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

export function FeaturedCollections() {
  return (
    <section className="relative overflow-hidden border-t border-ink/10 bg-ivory py-16 md:py-24">
      <Container className="relative">
        <FadeIn>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
                Edits
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
                Shop by mood
              </h2>
              <p className="mt-3 max-w-lg text-sm text-ink/65 md:text-base">
                From formal evenings to grounded daywear — enter a line for the
                atmosphere you want to carry.
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

        <Stagger className="grid items-stretch gap-4 md:grid-cols-3">
          {demoCollections.map((item, index) => (
            <StaggerItem key={item.slug} className="h-full">
              <Link
                href={`/products/${item.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-sm bg-ivory"
              >
                <div className="relative aspect-[3/4] shrink-0 overflow-hidden bg-stone/25">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width:768px) 100vw, 33vw"
                    priority={index === 0}
                  />
                </div>
                <div className="flex min-h-[6.75rem] flex-1 flex-col border-t border-ink/10 px-5 py-5">
                  <p className="font-display text-2xl text-ink">{item.name}</p>
                  <p className="mt-1 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-ink/65">
                    {item.detail}
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

export function FeaturedFabrics() {
  return (
    <section className="relative border-t border-ink/10 bg-stone py-16 md:py-24">
      <Container>
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
              Featured pieces
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
              Signature fabric lines
            </h2>
            <p className="mt-3 text-sm text-ink/65 md:text-base">
              A first look at the cloth that defines the house — each collection
              with its own palette, ready to open shade by shade.
            </p>
          </div>
        </FadeIn>

        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {demoFabrics.map((fabric) => (
            <StaggerItem key={fabric.slug}>
              <Link
                href={`/products/${fabric.slug}`}
                className="group block overflow-hidden rounded-sm bg-ivory transition-transform duration-feel hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={fabric.image}
                    alt={fabric.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
                    sizes="(max-width:768px) 50vw, 33vw"
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
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-wine">
                    Explore
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
            alt="FEELINGS editorial presentation"
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
    <section className="border-t border-ink/10 bg-ivory py-14 md:py-16">
      <Container>
        <Stagger className="grid gap-4 md:grid-cols-3">
          {demoAssurances.map((item) => (
            <StaggerItem key={item.title}>
              <div className="rounded-sm border border-ink/10 bg-stone/40 px-5 py-7">
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
