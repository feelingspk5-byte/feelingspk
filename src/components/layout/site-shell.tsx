import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCollections } from "@/lib/catalog";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const collections = getCollections();

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-stone text-ink">
          <AnnouncementBar />
          <Header collections={collections} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
