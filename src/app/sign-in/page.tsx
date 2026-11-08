import { SignInForm } from "@/components/auth/sign-in-form";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Sign in",
  description: "Sign in or create a FEELINGS account to complete checkout.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; notice?: string }>;
}) {
  const { next, notice } = await searchParams;

  return (
    <>
      <PageHeader
        title="Sign in"
        description="Create an account or sign in to complete payment and save your order details."
      />
      <Container className="py-10 md:py-14">
        <div className="mx-auto max-w-md">
          {notice === "checkout" ? (
            <p className="mb-6 rounded-sm border border-wine/30 bg-wine/5 px-4 py-3 text-sm text-ink/80">
              Sign in to continue to checkout. Your cart stays saved on this
              device.
            </p>
          ) : null}
          <SignInForm nextPath={next || "/account"} />
        </div>
      </Container>
    </>
  );
}
