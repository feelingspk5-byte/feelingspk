import { getStoreBackend } from "@/lib/store/file-store";

export function StoreBackendBanner() {
  const backend = getStoreBackend();
  if (backend === "blob" || backend === "file") return null;

  return (
    <div className="border-b border-wine/30 bg-wine/10 px-4 py-3 text-sm text-ink">
      <p className="font-medium text-wine">Shop sync is not durable yet</p>
      <p className="mt-1 text-ink/70">
        Add a Vercel Blob store to this project so admin prices, stock, and
        orders persist and appear on the live website. In the Vercel dashboard:
        Storage → Create Blob Store → connect this project (sets{" "}
        <code className="rounded-sm bg-ivory px-1">BLOB_READ_WRITE_TOKEN</code>
        ). Then redeploy.
      </p>
    </div>
  );
}
