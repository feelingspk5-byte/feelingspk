import { getStoreBackend } from "@/lib/store/file-store";

export function StoreBackendBanner() {
  const backend = getStoreBackend();

  if (backend === "supabase" || backend === "blob" || backend === "file") {
    return (
      <div className="border-b border-ink/10 bg-stone/60 px-4 py-2.5 text-sm text-ink/70">
        <p>
          <span className="font-medium text-ink">Shop sync is live</span>
          {" — "}
          products, prices, offers, CMS, collections, shipping, and settings
          save to durable storage ({backend}) and show on the website after you
          save.
        </p>
      </div>
    );
  }

  return (
    <div className="border-b border-wine/30 bg-wine/10 px-4 py-3 text-sm text-ink">
      <p className="font-medium text-wine">Shop sync is not durable yet</p>
      <p className="mt-1 text-ink/70">
        Connect Supabase so admin prices, stock, and orders persist on the live
        site. Create a free project at supabase.com, run{" "}
        <code className="rounded-sm bg-ivory px-1">
          migrations/002_runtime_store.sql
        </code>{" "}
        in the SQL editor, then add these Vercel env vars and redeploy:{" "}
        <code className="rounded-sm bg-ivory px-1">SUPABASE_URL</code> and{" "}
        <code className="rounded-sm bg-ivory px-1">
          SUPABASE_SERVICE_ROLE_KEY
        </code>
        .
      </p>
    </div>
  );
}
