import { ProductCard } from "@/components/catalog/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { FabricProduct } from "@/lib/types";

export function ProductGrid({
  products,
  emptyTitle = "Catalogue pending upload",
  emptyDescription = "FEELINGS products will appear here once the owner supplies catalogue PDFs, images, names and prices for fabric, stitched suits and shirts.",
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
