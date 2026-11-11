import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { getCms, getSiteConfig } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us",
  description:
    "About FEELINGS — Elite Men's Collection of unstitched fabric, stitched shalwar kameez, and dress shirts.",
};

const pillars = [
  {
    title: "Unstitched fabric",
    body: "Cloth chosen for drape, colour, and the freedom of a tailor’s hand — so every silhouette can be made for you.",
    image: "/brand/about/craft-fabric.jpg",
    alt: "Fine unstitched FEELINGS fabric inspected on the table",
    href: "/shop?category=unstitched_fabric",
  },
  {
    title: "Stitched shalwar kameez",
    body: "Ready elegance with a clean fall and considered finish — for days that ask for presence without fuss.",
    image: "/brand/about/line-shalwar.jpg",
    alt: "Gentleman in ivory stitched shalwar kameez",
    href: "/shop?category=stitched_shalwar_kameez",
  },
  {
    title: "Dress shirts",
    body: "Crisp formal shirts that close the look — refined collars, calm colour, lasting polish for work and occasion.",
    image: "/brand/about/line-house.jpg",
    alt: "Navy dress shirt with folded fabric in the FEELINGS house",
    href: "/shop?category=dress_shirt",
  },
];

const values = [
  {
    title: "Quiet luxury",
    body: "We favour restraint over noise — soft ivories, deep navies, and earth tones that feel timeless rather than trendy.",
  },
  {
    title: "Honest cloth",
    body: "Texture, shade, and hand-feel come first. What you see on the page should match what arrives in your hands.",
  },
  {
    title: "One coherent house",
    body: "Fabric, shalwar kameez, and shirts live under one brand so a man can dress from cloth to finished silhouette with ease.",
  },
  {
    title: "A considered journey",
    body: "Clear categories, clear colours, and human support on WhatsApp when you need a custom length or a second opinion.",
  },
];

export default function AboutPage() {
  const config = getSiteConfig();
  const about = getCms().about;

  return (
    <>
      {/* Full-bleed editorial hero */}
      <section className="relative min-h-[68vh] overflow-hidden bg-stone text-ink md:min-h-[78vh]">
        <Image
          src="/brand/about/hero-atelier.jpg"
          alt="FEELINGS atelier — quiet luxury for the modern gentleman"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone/92 via-stone/55 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone/50 via-transparent to-stone/25" />
        <Container className="relative flex min-h-[68vh] flex-col justify-end pb-14 pt-28 md:min-h-[78vh] md:justify-center md:pb-20">
          <p className="text-[10px] uppercase tracking-[0.32em] text-wine md:text-[11px]">
            Elite Men&apos;s Collection
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
            {about.title || "About FEELINGS"}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/75 md:text-base">
            {about.body ||
              "A house built for the modern Pakistani gentleman — tradition held with clarity, confidence worn without excess."}
          </p>
        </Container>
      </section>

      {/* Origin story */}
      <section className="border-b border-ink/10 bg-stone">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
            <Image
              src="/brand/about/craft-fabric.jpg"
              alt="Crafted cloth at the heart of FEELINGS"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
              Our story
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-5xl">
              Cloth first. Then the silhouette.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/75 md:text-base">
              <p>
                FEELINGS began with a simple belief: dressing well starts with
                good cloth. Before a stitch is made, colour, drape, and hand-feel
                already decide how a man will carry himself through the day.
              </p>
              <p>
                We built an Elite Men&apos;s Collection for men who want that
                foundation — whether they take fabric to a trusted tailor, step
                into a ready shalwar kameez, or finish the look with a composed
                dress shirt.
              </p>
              <p>
                From soft ivory calm to formal navy and winter depth, every
                shade is presented with honesty. No noise. No rush. Just
                considered choices for men who dress with intention.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Three lines */}
      <section className="bg-ivory">
        <Container className="py-16 md:py-24">
          <div className="mb-12 max-w-2xl md:mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
              The house
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-5xl">
              One house. Three ways to dress.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/70 md:text-base">
              FEELINGS gathers the essentials of a gentleman&apos;s wardrobe into
              a single, coherent experience — so you can move from fabric to
              finished form without leaving the house.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3 md:gap-6">
            {pillars.map((item) => (
              <article key={item.title} className="group">
                <Link href={item.href} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-5">
                    <div className="mb-3 h-px w-10 bg-wine" />
                    <h3 className="font-display text-2xl text-ink group-hover:text-wine">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">
                      {item.body}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-y border-ink/10 bg-stone">
        <Container className="py-16 md:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
              What we stand for
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-5xl">
              Dress with intention.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {values.map((item) => (
              <div key={item.title} className="border-t border-ink/15 pt-6">
                <h3 className="font-display text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70 md:text-base">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Promise + contact CTA */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 0%, rgba(245,241,233,0.18), transparent 55%)",
          }}
        />
        <Container className="relative grid gap-10 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-24">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/55">
              Our promise
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
              Premium presentation. Human support.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ivory/70 md:text-base">
              Whether you are preparing for Eid, a formal gathering, or the
              quiet rhythm of daily wear, FEELINGS aims to make the choice feel
              effortless — clear categories, true colour, and a team you can
              reach when you need us.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center rounded-sm bg-ivory px-6 text-sm tracking-wide text-ink transition-transform hover:-translate-y-0.5"
              >
                Explore the collection
              </Link>
              <Link
                href="/collections"
                className="inline-flex h-12 items-center rounded-sm border border-ivory/50 px-6 text-sm tracking-wide text-ivory transition-colors hover:bg-ivory hover:text-ink"
              >
                View collections
              </Link>
            </div>
          </div>
          <div className="space-y-4 border-t border-ivory/15 pt-6 text-sm text-ivory/75 md:border-t-0 md:pt-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/45">
              Speak with FEELINGS
            </p>
            {config.contactEmail ? (
              <p>
                <a
                  href={`mailto:${config.contactEmail}`}
                  className="transition-colors hover:text-ivory"
                >
                  {config.contactEmail}
                </a>
              </p>
            ) : null}
            {config.whatsapp ? (
              <p>
                WhatsApp{" "}
                <a
                  href={`https://wa.me/${config.whatsapp.replace(/\D/g, "").replace(/^0/, "92")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-ivory"
                >
                  {config.whatsapp}
                </a>
              </p>
            ) : null}
            {config.social.instagram ? (
              <p>
                Instagram{" "}
                <a
                  href={`https://instagram.com/${config.social.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-ivory"
                >
                  @{config.social.instagram}
                </a>
              </p>
            ) : null}
            <Link
              href="/contact"
              className="inline-flex pt-2 text-ivory underline-offset-4 hover:underline"
            >
              Go to Contact
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
