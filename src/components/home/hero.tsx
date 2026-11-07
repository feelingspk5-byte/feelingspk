import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";

const destinations = [
  {
    href: "/shop",
    label: "Shop All",
    detail: "Browse every fabric",
  },
  {
    href: "/shop?filter=new",
    label: "New Arrivals",
    detail: "Latest releases",
  },
  {
    href: "/collections",
    label: "Collections",
    detail: "Shop by fabric line",
  },
  {
    href: "/about",
    label: "About",
    detail: "The FEELINGS house",
  },
  {
    href: "/contact",
    label: "Contact",
    detail: "Order assistance",
  },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-ink text-ivory">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 10%, rgba(216,209,198,0.35), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(107,38,56,0.28), transparent 45%), repeating-linear-gradient(115deg, rgba(245,241,233,0.04) 0 1px, transparent 1px 14px)",
        }}
      />

      <Container className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-between gap-8 py-8 md:min-h-[calc(100vh-4.5rem)] md:gap-12 md:py-14 lg:py-16">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-stone md:text-[11px]">
            Men&apos;s unstitched shalwar kameez fabric
          </p>
          <h1 className="sr-only">
            FEELINGS — Men&apos;s Unstitched Fabrics
          </h1>
          <div className="mt-5 flex justify-center md:mt-8">
            <BrandLogo
              variant="heroDark"
              priority
              className="max-w-[12.5rem] sm:max-w-xs md:max-w-sm"
            />
          </div>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ivory/70 md:mt-8 md:text-base">
            Traditional Pakistani luxury, presented with modern clarity. Discover
            fabric collections, the house story, and support — all from here.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-9">
            <Link
              href="/shop"
              className="inline-flex h-11 min-w-[9.5rem] items-center justify-center rounded-sm bg-ivory px-5 text-sm tracking-[0.08em] text-ink transition-colors duration-feel hover:bg-stone md:h-12 md:min-w-[10.5rem] md:px-6"
            >
              Shop Fabrics
            </Link>
            <Link
              href="/about"
              className="inline-flex h-11 min-w-[9.5rem] items-center justify-center rounded-sm border border-ivory/35 px-5 text-sm tracking-[0.08em] text-ivory transition-colors duration-feel hover:border-ivory hover:bg-ivory/5 md:h-12 md:min-w-[10.5rem] md:px-6"
            >
              About the House
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-4 md:mb-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/45">
              Explore
            </p>
            <div className="h-px flex-1 bg-ivory/15" />
          </div>
          <nav
            aria-label="Homepage destinations"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
          >
            {destinations.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-sm border border-ivory/15 bg-ivory/[0.03] px-4 py-4 text-left transition-colors duration-feel hover:border-wine/60 hover:bg-ivory/[0.07]"
              >
                <span className="block text-[12px] uppercase tracking-[0.16em] text-ivory group-hover:text-stone">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs text-ivory/45">
                  {item.detail}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
