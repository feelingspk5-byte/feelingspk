"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { FadeIn, Stagger, StaggerItem } from "@/components/home/motion";
import { Container } from "@/components/layout/container";
import { demoHero } from "@/data/demo-home";

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
  return (
    <section className="relative overflow-hidden bg-stone text-ink">
      <div className="relative grid min-h-[78vh] md:min-h-[86vh] md:grid-cols-[minmax(17.5rem,0.92fr)_1.08fr_1.08fr_1.08fr]">
        {/* Brand column — solid stage so FEELINGS and copy stay crisp */}
        <div className="relative z-10 flex flex-col justify-center border-b border-ink/10 px-6 py-16 sm:px-8 md:border-b-0 md:border-r md:border-ink/10 md:px-10 md:py-24 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 10%, rgba(107,38,56,0.08), transparent 55%), linear-gradient(160deg, rgba(245,241,233,0.9), transparent 60%)",
            }}
          />
          <div className="relative max-w-md">
            <FadeIn>
              <div className="max-w-[15rem] sm:max-w-[17rem] md:max-w-[18rem]">
                <BrandLogo variant="hero" priority />
              </div>
            </FadeIn>
            <h1 className="sr-only">FEELINGS — {demoHero.title}</h1>
            <FadeIn delay={0.1}>
              <p className="mt-7 font-display text-[1.85rem] leading-[1.12] tracking-tight text-ink sm:text-4xl md:mt-8 md:text-[2.55rem]">
                {demoHero.title}
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/70 md:text-[0.95rem]">
                {demoHero.subtitle}
              </p>
            </FadeIn>
            <FadeIn delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-9">
                <Link
                  href="/shop"
                  className="inline-flex h-12 min-w-[10rem] items-center justify-center rounded-sm bg-ink px-6 text-sm tracking-[0.08em] text-ivory transition-transform duration-feel hover:-translate-y-0.5"
                >
                  Explore the Collection
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex h-12 min-w-[10rem] items-center justify-center rounded-sm border border-ink bg-transparent px-6 text-sm tracking-[0.08em] text-ink transition-colors duration-feel hover:bg-ink hover:text-ivory"
                >
                  View Collections
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Three product panels — fully visible, no copy over them */}
        {demoHero.panels.map((panel, index) => (
          <div
            key={panel.src}
            className="relative min-h-[42vh] overflow-hidden md:min-h-full"
          >
            <Image
              src={panel.src}
              alt={panel.alt}
              fill
              priority
              className={[
                "object-cover transition-transform duration-[1.4s] ease-out will-change-transform hover:scale-[1.03]",
                index === 0
                  ? "object-[50%_40%]"
                  : index === 1
                    ? "object-[50%_18%]"
                    : "object-[50%_28%]",
              ].join(" ")}
              sizes="(max-width:768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-ink/10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 to-transparent" />
            <p className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.22em] text-ivory md:bottom-5 md:left-5 md:text-[11px]">
              {panel.label}
            </p>
          </div>
        ))}
      </div>

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
    </section>
  );
}
