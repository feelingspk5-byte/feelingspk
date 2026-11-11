"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SiteConfig } from "@/lib/types";

export function SettingsEditor({ initial }: { initial: SiteConfig }) {
  const router = useRouter();
  const [config, setConfig] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setBusy(false);
    if (!res.ok) {
      setMessage("Could not save settings.");
      return;
    }
    setMessage("Settings saved.");
    router.refresh();
  }

  const codOn = config.paymentMethods.includes("Cash on Delivery");

  return (
    <form onSubmit={save} className="space-y-6 border border-ink/10 bg-ivory p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm md:col-span-2">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Announcement bar
          </span>
          <Input
            value={config.announcement ?? ""}
            onChange={(e) =>
              setConfig({ ...config, announcement: e.target.value || null })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Phone
          </span>
          <Input
            value={config.contactPhone ?? ""}
            onChange={(e) =>
              setConfig({ ...config, contactPhone: e.target.value || null })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            WhatsApp
          </span>
          <Input
            value={config.whatsapp ?? ""}
            onChange={(e) =>
              setConfig({ ...config, whatsapp: e.target.value || null })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Email
          </span>
          <Input
            value={config.contactEmail ?? ""}
            onChange={(e) =>
              setConfig({ ...config, contactEmail: e.target.value || null })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Instagram
          </span>
          <Input
            value={config.social.instagram ?? ""}
            onChange={(e) =>
              setConfig({
                ...config,
                social: { ...config.social, instagram: e.target.value || null },
              })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Currency
          </span>
          <Input
            value={config.currencyPlaceholder}
            onChange={(e) =>
              setConfig({ ...config, currencyPlaceholder: e.target.value })
            }
          />
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={codOn}
            onChange={(e) =>
              setConfig({
                ...config,
                paymentMethods: e.target.checked
                  ? ["Cash on Delivery"]
                  : [],
                checkoutConnected: e.target.checked,
              })
            }
          />
          Cash on Delivery enabled
        </label>
      </div>
      {message ? <p className="text-sm text-ink/60">{message}</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
