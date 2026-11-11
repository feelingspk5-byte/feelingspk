import { toTelHref, toWhatsAppHref } from "@/lib/phone";

export function CallClientActions({
  phone,
  name,
  compact = false,
}: {
  phone: string;
  name?: string;
  compact?: boolean;
}) {
  const tel = toTelHref(phone);
  const wa = toWhatsAppHref(phone);
  const label = name ? `Call ${name}` : "Call client";

  if (!tel && !wa) {
    return (
      <span className="text-xs text-ink/40" title="No valid phone number">
        —
      </span>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center justify-end gap-1.5">
        {tel ? (
          <a
            href={tel}
            className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-ink px-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-wine"
            title={label}
            aria-label={label}
          >
            <PhoneIcon />
            Call
          </a>
        ) : null}
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center rounded-sm border border-ink/20 px-2.5 text-[11px] uppercase tracking-[0.12em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
            title="WhatsApp"
            aria-label={`WhatsApp ${name ?? "client"}`}
          >
            WA
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {tel ? (
        <a
          href={tel}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-sm bg-ink px-4 text-sm tracking-wide text-ivory transition-colors hover:bg-wine"
        >
          <PhoneIcon />
          Call client
        </a>
      ) : null}
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-sm border border-ink px-4 text-sm tracking-wide text-ink transition-colors hover:bg-ink hover:text-ivory"
        >
          WhatsApp
        </a>
      ) : null}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M6.6 3.8c.4-.4 1-.5 1.5-.3l2.2.9c.5.2.8.7.8 1.2l-.2 2.3c0 .4-.2.7-.5.9l-1.2.9a12.2 12.2 0 0 0 5.4 5.4l.9-1.2c.2-.3.5-.5.9-.5l2.3-.2c.5 0 1 .3 1.2.8l.9 2.2c.2.5.1 1.1-.3 1.5l-1.3 1.3c-.4.4-1 .6-1.6.5-3.3-.5-6.4-2.3-8.8-4.7S4.4 9.3 3.9 6c-.1-.6.1-1.2.5-1.6L6.6 3.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
