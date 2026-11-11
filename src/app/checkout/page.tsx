import { CheckoutForm } from "@/components/cart/checkout-form";
import { Container } from "@/components/layout/container";

export const metadata = {
  title: "Checkout",
  description:
    "Complete your FEELINGS order — Cash on Delivery across Pakistan.",
};

export default function CheckoutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10 bg-stone">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 10% 0%, rgba(107,38,56,0.08), transparent 50%), linear-gradient(180deg, rgba(245,241,233,0.5), transparent 75%)",
          }}
        />
        <Container className="relative py-14 md:py-20">
          <p className="text-[10px] uppercase tracking-[0.32em] text-wine md:text-[11px]">
            Elite Men&apos;s Collection
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">
            Checkout
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/70 md:text-base">
            Confirm delivery details and place your order with Cash on Delivery.
            We will confirm on WhatsApp before dispatch.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-ink/45">
            <span>Cash on Delivery</span>
            <span className="hidden h-3 w-px bg-ink/20 sm:block" aria-hidden />
            <span>WhatsApp confirmation</span>
            <span className="hidden h-3 w-px bg-ink/20 sm:block" aria-hidden />
            <span>Nationwide delivery</span>
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <CheckoutForm />
      </Container>
    </>
  );
}
