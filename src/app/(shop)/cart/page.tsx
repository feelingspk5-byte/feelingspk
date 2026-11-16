import { CartView } from "@/components/cart/cart-view";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getSiteConfig } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cart",
  description: "Review FEELINGS fabric selections before checkout.",
};

export default function CartPage() {
  const siteConfig = getSiteConfig();

  return (
    <>
      <PageHeader
        title="Cart"
        description="Line items show fabric name, colour/variant, cut or quantity, and pricing when available."
      />
      <Container className="py-10 md:py-14">
        <CartView
          siteConfig={{
            currencyPlaceholder: siteConfig.currencyPlaceholder,
          }}
        />
      </Container>
    </>
  );
}
