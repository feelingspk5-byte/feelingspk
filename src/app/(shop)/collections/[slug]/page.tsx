import { notFound, redirect } from "next/navigation";
import {
  getCollectionBySlug,
  getProductsByCollection,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

/**
 * Collection detail was a redundant shade grid — the product page already
 * handles shade selection. Keep this route as a redirect for old links.
 */
export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const product = getProductsByCollection(slug)[0];
  if (!product) notFound();

  redirect(`/products/${product.slug}`);
}
