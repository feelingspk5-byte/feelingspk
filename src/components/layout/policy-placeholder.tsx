import { EmptyState } from "@/components/ui/empty-state";

export function PolicyPlaceholder({ topic }: { topic: string }) {
  return (
    <EmptyState
      title={`${topic} pending owner approval`}
      description="FEELINGS will supply the final policy text. Until then, this page exists in the site structure without invented terms, charges or promises."
    />
  );
}
