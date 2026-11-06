import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.2em] text-wine">404</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink/65">
        This page is not available. Return to the FEELINGS fabric shop.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-sm bg-ink px-5 text-sm text-ivory"
      >
        Back to home
      </Link>
    </Container>
  );
}
