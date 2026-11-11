import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { CmsEditor } from "@/components/admin/cms-editor";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminCmsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Website</h1>
          <p className="mt-2 text-sm text-ink/60">
            Edit homepage hero, About, Contact intro, FAQ, and footer note.
          </p>
        </div>
        <CmsEditor initial={readStore().cms} />
      </div>
    </AdminShell>
  );
}
