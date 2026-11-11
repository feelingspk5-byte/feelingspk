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
    <div className="admin-workspace flex min-h-screen items-center px-4 py-16">
      <div className="mx-auto w-full max-w-lg rounded-sm border border-ink/10 bg-ivory p-8 shadow-[0_16px_48px_rgba(23,23,23,0.06)] md:p-10">
        <p className="text-[10px] uppercase tracking-[0.22em] text-wine">
          FEELINGS · Staff desk
        </p>
        <AdminLoginForm setup={setup} />
      </div>
    </div>
  );
}
