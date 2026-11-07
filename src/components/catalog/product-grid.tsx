import { ProductCard } from "@/components/catalog/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { FabricProduct } from "@/lib/types";

export function ProductGrid({
  products,
  emptyTitle = "New pieces are being prepared",
  emptyDescription = "Explore categories above — unstitched fabric, stitched shalwar kameez, and dress shirts will fill this grid as the collection goes live.",
}: {
  products: FabricProduct[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (products.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
