import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import {
  adminIsConfigured,
  getAdminSession,
} from "@/lib/store/admin-auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const setup = !adminIsConfigured();

  return (
    <div className="flex min-h-screen items-center bg-stone px-4 py-16">
      <div className="mx-auto w-full max-w-lg border border-ink/10 bg-ivory p-8 md:p-10">
        <AdminLoginForm setup={setup} />
      </div>
    </div>
  );
}
