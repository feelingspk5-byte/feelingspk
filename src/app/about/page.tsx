import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "About Us",
  description:
    "About FEELINGS — Elite Men's Collection of unstitched fabric, stitched shalwar kameez, and dress shirts.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About FEELINGS"
        description="An Elite Men's Collection shaped by tradition, clarity, and quiet confidence."
      />
      <Container className="space-y-14 py-10 md:py-16">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-ink/80 md:text-lg">
          <p>
            FEELINGS was created for the modern Pakistani gentleman who values
            presence without excess. We believe dressing well begins with good
            cloth, honest finishing, and choices that feel considered — not
            rushed.
          </p>
          <p>
            Our Elite Men&apos;s Collection brings three essential paths into
            one house: unstitched fabric for men who trust a tailor&apos;s hand,
            stitched shalwar kameez for those who want ready elegance in their
            size, and dress shirts that complete the look with composure.
          </p>
          <p>
            From soft ivory calm to formal navy and winter warmth, every piece
            is presented with clarity — so you can see texture, colour, and form
            before you decide. The experience is designed to feel premium,
            calm, and trustworthy from first browse to final order.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Unstitched fabric",
              body: "Cloth selected for drape, colour fidelity, and the freedom to tailor exactly as you wish.",
            },
            {
              title: "Stitched shalwar kameez",
              body: "Ready silhouettes finished with care, offered in clear sizes for a confident everyday fit.",
            },
            {
              title: "Dress shirts",
              body: "Crisp formal shirts for work and occasion — refined collars, clean lines, lasting polish.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-sm border border-ink/10 bg-ivory px-5 py-7"
            >
              <div className="mb-4 h-px w-10 bg-wine" />
              <h2 className="font-display text-2xl text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl rounded-sm border border-ink/10 bg-stone/50 px-6 py-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-wine">
            Our promise
          </p>
          <p className="mt-3 font-display text-3xl tracking-tight text-ink">
            Dress with intention.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70 md:text-base">
            Whether you are preparing for Eid, a formal gathering, or the quiet
            rhythm of daily wear, FEELINGS aims to make the choice feel
            effortless — premium presentation, clear categories, and a shopping
            journey worthy of the wardrobe.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center rounded-sm bg-ink px-5 text-sm tracking-wide text-ivory"
            >
              Shop the collection
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-sm border border-ink px-5 text-sm tracking-wide text-ink"
            >
              Speak with us
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
