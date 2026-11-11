"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/logo";
import { FadeIn, Stagger, StaggerItem } from "@/components/home/motion";
import { Container } from "@/components/layout/container";
import { demoHero } from "@/data/demo-home";
import type { CmsContent } from "@/lib/store/types";

const SLIDE_MS = 5000;

type HeroContent = CmsContent["hero"];

const destinations = [
  { href: "/shop", label: "Shop All", detail: "The full house" },
  {
    href: "/shop?category=unstitched_fabric",
    label: "Fabric",
    detail: "Unstitched cloth",
  },
  {
    href: "/shop?category=stitched_shalwar_kameez",
    label: "Shalwar Kameez",
    detail: "Stitched readywear",
  },
  {
    href: "/shop?category=dress_shirt",
    label: "Dress Shirts",
    detail: "Formal shirts",
  },
  { href: "/collections", label: "Collections", detail: "Shop by line" },
];

export function HomeHero({ content }: { content?: HeroContent }) {
  const hero = content ?? {
    eyebrow: demoHero.eyebrow,
    title: demoHero.title,
    subtitle: demoHero.subtitle,
    slides: demoHero.slides,
  };
  const slides = hero.slides;
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
      setTick((value) => value + 1);
    },
    [slides.length],
  );

  // Preload every slide image into the browser cache before rotating
  useEffect(() => {
    let cancelled = false;
    const loaders = slides.map(
      (slide) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = slide.src;
        }),
    );

    Promise.all(loaders).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [slides]);

  useEffect(() => {
    if (!ready || reduce || hidden || slides.length < 2) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
      setTick((value) => value + 1);
    }, SLIDE_MS);

    return () => window.clearInterval(id);
  }, [ready, hidden, reduce, slides.length]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const active = slides[index];

  return (
    <section className="relative overflow-hidden bg-stone text-ink">
      <div className="relative min-h-[70vh] md:min-h-[78vh] lg:min-h-[82vh]">
        {/* Keep ALL slides mounted — crossfade opacity only, no blank remount */}
        <div className="absolute inset-0">
          {slides.map((slide, i) => {
            const isActive = i === index;
            return (
              <div
                key={slide.src}
                aria-hidden={!isActive}
                className={[
                  "absolute inset-0 transition-opacity ease-out",
                  reduce ? "duration-0" : "duration-700",
                  isActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority
                  quality={75}
                  className={`object-cover ${slide.position}`}
                  sizes="100vw"
                />
              </div>
            );
          })}

          {/* Soft cream wash — keeps black FEELINGS logo and copy crisp on the wall */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone/95 via-stone/60 to-transparent md:via-[38%] md:to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone/35 via-transparent to-stone/20" />
        </div>

        <Container className="relative flex min-h-[70vh] flex-col justify-center pb-16 pt-28 md:min-h-[78vh] md:pb-20 md:pt-24 lg:min-h-[82vh]">
          <div className="max-w-[18rem] sm:max-w-sm md:max-w-[22rem] lg:max-w-md">
            <FadeIn>
              <p className="text-[10px] uppercase tracking-[0.32em] text-wine md:text-[11px]">
                {hero.eyebrow}
              </p>
            </FadeIn>
            <h1 className="sr-only">FEELINGS — {hero.title}</h1>
            <FadeIn delay={0.08}>
              <div className="mt-5 max-w-[13rem] sm:max-w-[15rem] md:mt-7 md:max-w-[17rem]">
                <BrandLogo variant="hero" priority />
              </div>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mt-6 font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl md:mt-8 md:text-[2.65rem]">
                {hero.title}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink/75 md:text-base">
                {hero.subtitle}
              </p>
            </FadeIn>
            <FadeIn delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3 md:mt-9">
                <Link
                  href="/shop"
                  className="inline-flex h-12 min-w-[10rem] items-center justify-center rounded-sm bg-ink px-6 text-sm tracking-[0.08em] text-ivory transition-transform duration-feel hover:-translate-y-0.5"
                >
                  Explore the Collection
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex h-12 min-w-[10rem] items-center justify-center rounded-sm border border-ink bg-ivory/70 px-6 text-sm tracking-[0.08em] text-ink backdrop-blur-sm transition-colors duration-feel hover:bg-ink hover:text-ivory"
                >
                  View Collections
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Slide controls */}
          <div className="mt-12 flex flex-col gap-4 md:mt-16 md:absolute md:bottom-10 md:right-8 md:mt-0 lg:right-12">
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink/55 md:text-right">
              {active.label}
            </p>
            <div className="flex items-center gap-3 md:justify-end">
              {slides.map((slide, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={slide.src}
                    type="button"
                    aria-label={`Show ${slide.label}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => goTo(i)}
                    className="group relative h-1.5 w-12 overflow-hidden rounded-sm bg-ink/20 md:w-16"
                  >
                    {isActive ? (
                      <span
                        key={`${index}-${tick}`}
                        className={
                          reduce || !ready
                            ? "absolute inset-y-0 left-0 w-full bg-ink"
                            : "absolute inset-y-0 left-0 animate-[heroProgress_5s_linear_forwards] bg-ink"
                        }
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-stone text-ink">
        <Container className="relative pb-10 pt-8 md:pb-14 md:pt-10">
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
      </div>
    </section>
  );
}
