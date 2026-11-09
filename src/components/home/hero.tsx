"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/logo";
import { FadeIn, Stagger, StaggerItem } from "@/components/home/motion";
import { Container } from "@/components/layout/container";
import { demoHero } from "@/data/demo-home";

const SLIDE_MS = 5000;

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

export function HomeHero() {
  const slides = demoHero.slides;
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [hidden, setHidden] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
      setTick((value) => value + 1);
    },
    [slides.length],
  );

  useEffect(() => {
    if (reduce || hidden || slides.length < 2) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
      setTick((value) => value + 1);
    }, SLIDE_MS);

    return () => window.clearInterval(id);
  }, [hidden, reduce, slides.length]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const active = slides[index];

  return (
    <section className="relative overflow-hidden bg-ink text-ivory">
      <div className="relative min-h-[70vh] md:min-h-[78vh] lg:min-h-[82vh]">
        {/* Full-bleed rotating backgrounds — wide 16:9 assets, gentle scale */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={active.src}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                priority
                className={`object-cover ${active.position}`}
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Cinematic wash — logo and copy stay readable on every slide */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/40 to-ink/15" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-ink/30" />
        </div>

        <Container className="relative flex min-h-[70vh] flex-col justify-end pb-16 pt-28 md:min-h-[78vh] md:justify-center md:pb-20 md:pt-24 lg:min-h-[82vh]">
          <div className="max-w-xl">
            <FadeIn>
              <p className="text-[10px] uppercase tracking-[0.32em] text-ivory/70 md:text-[11px]">
                {demoHero.eyebrow}
              </p>
            </FadeIn>
            <h1 className="sr-only">FEELINGS — {demoHero.title}</h1>
            <FadeIn delay={0.08}>
              <div className="mt-5 max-w-[15rem] sm:max-w-[18rem] md:mt-7 md:max-w-[20rem]">
                <BrandLogo variant="heroDark" priority className="brightness-0 invert" />
              </div>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mt-6 font-display text-3xl leading-tight tracking-tight text-ivory sm:text-4xl md:mt-8 md:text-5xl">
                {demoHero.title}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/75 md:text-base">
                {demoHero.subtitle}
              </p>
            </FadeIn>
            <FadeIn delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3 md:mt-9">
                <Link
                  href="/shop"
                  className="inline-flex h-12 min-w-[10rem] items-center justify-center rounded-sm bg-ivory px-6 text-sm tracking-[0.08em] text-ink transition-transform duration-feel hover:-translate-y-0.5"
                >
                  Explore the Collection
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex h-12 min-w-[10rem] items-center justify-center rounded-sm border border-ivory/70 bg-transparent px-6 text-sm tracking-[0.08em] text-ivory transition-colors duration-feel hover:bg-ivory hover:text-ink"
                >
                  View Collections
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Slide controls — progress + labels */}
          <div className="mt-12 flex flex-col gap-4 md:mt-16 md:absolute md:bottom-10 md:right-8 md:mt-0 lg:right-12">
            <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/65 md:text-right">
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
                    className="group relative h-1.5 w-12 overflow-hidden rounded-sm bg-ivory/25 md:w-16"
                  >
                    {isActive ? (
                      <span
                        key={`${index}-${tick}`}
                        className={
                          reduce
                            ? "absolute inset-y-0 left-0 w-full bg-ivory"
                            : "absolute inset-y-0 left-0 animate-[heroProgress_5s_linear_forwards] bg-ivory"
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
