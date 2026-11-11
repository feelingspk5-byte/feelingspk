import { CartView } from "@/components/cart/cart-view";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Cart",
  description: "Review FEELINGS fabric selections before checkout.",
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        title="Cart"
        description="Line items show fabric name, colour/variant, cut or quantity, and pricing when available."
      />
      <Container className="py-10 md:py-14">
        <CartView />
      </Container>
    </>
  );
}
