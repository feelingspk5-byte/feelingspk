import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
    "/collections",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/exchanges",
    "/privacy",
    "/terms",
    "/cart",
    "/checkout",
  ].map((path) => ({
    url: path || "/",
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const products = getProducts().map((p) => ({
    url: `/products/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...products];
}
