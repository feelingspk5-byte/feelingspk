import { getSiteConfig } from "@/lib/catalog";
import { Container } from "@/components/layout/container";

export function AnnouncementBar() {
  const { announcement } = getSiteConfig();
  if (!announcement) return null;

  return (
    <div className="border-b border-ink/10 bg-ink text-ivory">
      <Container className="py-2 text-center text-xs tracking-wide sm:text-sm">
        {announcement}
      </Container>
    </div>
  );
}
