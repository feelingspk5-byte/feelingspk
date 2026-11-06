import { CheckoutForm } from "@/components/cart/checkout-form";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Checkout",
  description: "Secure FEELINGS fabric checkout structure.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        title="Checkout"
        description="Collects delivery details for the future order integration. Payment is not connected — no real order is placed."
      />
      <Container className="py-10 md:py-14">
        <CheckoutForm />
      </Container>
    </>
  );
}
