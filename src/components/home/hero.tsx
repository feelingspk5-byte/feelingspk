"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { FadeIn, Stagger, StaggerItem } from "@/components/home/motion";
import { Container } from "@/components/layout/container";
import { VectorBackdrop } from "@/components/ui/vector-backdrop";
import { demoHero } from "@/data/demo-home";

const destinations = [
  { href: "/shop", label: "Shop All", detail: "Full collection" },
  {
    href: "/shop?category=unstitched_fabric",
    label: "Fabric",
    detail: "Unstitched cloth",
  },
  {
    href: "/shop?category=stitched_shalwar_kameez",
    label: "Stitched",
    detail: "Shalwar kameez",
  },
  {
    href: "/shop?category=dress_shirt",
    label: "Shirts",
    detail: "Dress shirts",
  },
  { href: "/about", label: "About", detail: "The FEELINGS house" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-stone text-ink">
      <div className="relative min-h-[72vh] md:min-h-[78vh]">
        <Image
          src={demoHero.image}
          alt="Premium men's collection sample imagery"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone via-stone/55 to-stone/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone/50 via-transparent to-transparent" />
        <VectorBackdrop className="opacity-50" />

        <Container className="relative flex min-h-[72vh] flex-col justify-end pb-10 pt-28 md:min-h-[78vh] md:pb-14">
          <FadeIn>
            <p className="text-[10px] uppercase tracking-[0.28em] text-wine md:text-[11px]">
              {demoHero.eyebrow}
            </p>
          </FadeIn>
          <h1 className="sr-only">FEELINGS — {demoHero.title}</h1>
          <FadeIn delay={0.08}>
            <div className="mt-5 max-w-sm md:mt-7 md:max-w-md">
              <BrandLogo variant="hero" priority />
            </div>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-5 max-w-xl font-display text-3xl leading-tight tracking-tight text-ink md:mt-7 md:text-5xl">
              {demoHero.title}
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/75 md:text-base">
              {demoHero.subtitle}
            </p>
          </FadeIn>
          <FadeIn delay={0.24}>
            <div className="mt-7 flex flex-wrap gap-3 md:mt-9">
              <Link
                href="/shop"
                className="inline-flex h-12 min-w-[10rem] items-center justify-center rounded-sm bg-ink px-6 text-sm tracking-[0.08em] text-ivory transition-transform duration-feel hover:-translate-y-0.5"
              >
                Shop Fabrics
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 min-w-[10rem] items-center justify-center rounded-sm border border-ink bg-ivory/70 px-6 text-sm tracking-[0.08em] text-ink backdrop-blur-sm transition-colors duration-feel hover:bg-ink hover:text-ivory"
              >
                About the House
              </Link>
            </div>
          </FadeIn>
        </Container>
      </div>

      <Container className="relative pb-10 pt-2 md:pb-14">
        <div className="mb-3 flex items-center gap-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
            Explore
          </p>
          <div className="h-px flex-1 bg-ink/15" />
        </div>
        <Stagger className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {destinations.map((item) => (
            <StaggerItem key={item.href}>
              <Link
                href={item.href}
                className="group block rounded-sm border border-ink/10 bg-ivory px-4 py-4 transition-all duration-feel hover:-translate-y-0.5 hover:border-wine/40 hover:shadow-[0_12px_30px_rgba(23,23,23,0.06)]"
              >
                <span className="block text-[12px] uppercase tracking-[0.16em] text-ink group-hover:text-wine">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs text-ink/50">
                  {item.detail}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
