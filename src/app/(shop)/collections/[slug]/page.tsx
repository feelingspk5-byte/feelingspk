import { notFound, redirect } from "next/navigation";
import {
  getCollectionBySlug,
  getProductsByCollection,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

/** Old shade-grid page — skip straight to the product (colour bars + preview). */
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
