import { revalidatePath } from "next/cache";

/** Bust every public surface that reads the runtime store. */
export function revalidateStorefront(extra: string[] = []) {
  const paths = [
    "/",
    "/shop",
    "/collections",
    "/cart",
    "/checkout",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/admin",
    "/admin/products",
    "/admin/collections",
    "/admin/offers",
    "/admin/cms",
    "/admin/settings",
    "/admin/shipping",
    "/admin/media",
    ...extra,
  ];

  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      /* build / non-request contexts */
    }
  }
}
