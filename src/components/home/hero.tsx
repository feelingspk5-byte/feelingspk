"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand/logo";
import { FadeIn, Stagger, StaggerItem } from "@/components/home/motion";
import { Container } from "@/components/layout/container";
import { demoHero } from "@/data/demo-home";
import type { CmsContent, HeroSlide } from "@/lib/store/types";

const SLIDE_MS = 5000;

type HeroContent = CmsContent["hero"];

const destinations = [
  { href: "/shop", label: "Shop All", detail: "The full house" },
  {
    href: "/collections",
    label: "Collections",
    detail: "Six fabric lines",
  },
  {
    href: "/shop?category=stitched_shalwar_kameez",
    label: "Shalwar Kameez",
    detail: "Coming soon",
  },
  {
    href: "/shop?category=dress_shirt",
    label: "Dress Shirts",
    detail: "Coming soon",
  },
];

function HeroSlides({
  slides,
  index,
  reduce,
}: {
  slides: HeroSlide[];
  index: number;
  reduce: boolean | null;
}) {
  return (
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
              priority={i === 0}
              quality={75}
              className={`object-cover ${slide.position ?? "object-center"}`}
              sizes="100vw"
            />
          </div>
        );
      })}
    </div>
  );
}

function HeroProgress({
  slides,
  index,
  tick,
  ready,
  reduce,
  onSelect,
  align = "start",
}: {
  slides: HeroSlide[];
  index: number;
  tick: number;
  ready: boolean;
  reduce: boolean | null;
  onSelect: (next: number) => void;
  align?: "start" | "end";
}) {
  const active = slides[index] ?? slides[0];

  return (
    <div
      className={[
        "flex flex-col gap-3",
        align === "end" ? "items-end text-right" : "items-start",
      ].join(" ")}
    >
      <p className="text-[10px] uppercase tracking-[0.28em] text-ink/55">
        {active?.label}
      </p>
      <div className="flex items-center gap-3">
        {slides.map((slide, i) => {
          const isActive = i === index;
          return (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show ${slide.label}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelect(i)}
              className="relative h-1.5 w-12 overflow-hidden rounded-sm bg-ink/20 md:w-16"
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
  );
}

export function HomeHero({ content }: { content?: HeroContent }) {
  const hero = content ?? {
    eyebrow: demoHero.eyebrow,
    title: demoHero.title,
    subtitle: demoHero.subtitle,
    slides: demoHero.slides,
  };
  const slides = useMemo(
    () => (hero.slides?.length ? hero.slides : demoHero.slides),
    [hero.slides],
  );
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

  const slideSrcKey = slides.map((s) => s.src).join("|");

  useEffect(() => {
    let cancelled = false;
    let settled = 0;
    const total = slides.length;
    if (total === 0) {
      setReady(true);
      return;
    }

    slides.forEach((slide) => {
      const img = new window.Image();
      const done = () => {
        settled += 1;
        if (!cancelled && settled >= total) setReady(true);
      };
      img.onload = done;
      img.onerror = done;
      img.src = slide.src;
    });

    return () => {
      cancelled = true;
    };
    // Only re-preload when the slide sources change, not on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideSrcKey]);

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

  const copy = (
    <>
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
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-9">
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
    </>
  );

  return (
    <section className="relative overflow-hidden bg-stone text-ink">
      {/* Mobile: full-width product image, then copy */}
      <div className="md:hidden">
        <div className="relative h-[52vh] min-h-[280px] max-h-[420px] w-full overflow-hidden">
          <HeroSlides slides={slides} index={index} reduce={reduce} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <HeroProgress
              slides={slides}
              index={index}
              tick={tick}
              ready={ready}
              reduce={reduce}
              onSelect={goTo}
            />
          </div>
        </div>
        <Container className="pb-10 pt-6">
          <div className="max-w-md">{copy}</div>
        </Container>
      </div>

      {/* Desktop: left copy over cream wash, product in the right plane */}
      <div className="relative hidden min-h-[78vh] md:block lg:min-h-[82vh]">
        <HeroSlides slides={slides} index={index} reduce={reduce} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone/95 via-stone/60 to-transparent via-[38%]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone/35 via-transparent to-stone/20" />

        <Container className="relative flex min-h-[78vh] flex-col justify-center pb-20 pt-24 lg:min-h-[82vh]">
          <div className="max-w-[22rem] lg:max-w-md">{copy}</div>
          <div className="absolute bottom-10 right-8 lg:right-12">
            <HeroProgress
              slides={slides}
              index={index}
              tick={tick}
              ready={ready}
              reduce={reduce}
              onSelect={goTo}
              align="end"
            />
          </div>
        </Container>
      </div>

      <div className="bg-stone text-ink">
        <Container className="relative pb-10 pt-2 md:pb-14 md:pt-10">
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
