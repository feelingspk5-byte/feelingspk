import { SiteShell } from "@/components/layout/site-shell";
import { ensureStore } from "@/lib/store/file-store";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureStore();
  return <SiteShell>{children}</SiteShell>;
}
