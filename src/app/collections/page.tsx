import { CollectionTile } from "@/components/catalog/collection-tile";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getCollections } from "@/lib/catalog";

export const metadata = {
  title: "Collections",
  description: "FEELINGS fabric collections and seasonal edits.",
};

export default function CollectionsPage() {
  const collections = getCollections();

  return (
    <>
      <PageHeader
        title="Collections"
        description="Unstitched fabric lines from FEELINGS — open any collection to see every colour, then choose your length."
      />
      <Container className="py-10 md:py-14">
        {collections.length === 0 ? (
          <EmptyState
            title="Collections awaiting catalogue"
            description="Upload confirmed collection names and imagery to populate this page. Do not invent Cotton, Wash & Wear or other categories until the catalogue confirms them."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <CollectionTile key={c.id} collection={c} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
