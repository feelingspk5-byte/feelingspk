import type { Metadata } from "next";
import { ensureStore } from "@/lib/store/file-store";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load durable catalogue before any admin page reads products/prices.
  await ensureStore();
  return children;
}
