import { cn } from "@/lib/cn";

type IconProps = {
  className?: string;
  title?: string;
};

function baseProps(className: string | undefined, title?: string) {
  return {
    className: cn("h-5 w-5", className),
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.75,
    viewBox: "0 0 24 24",
    "aria-hidden": title ? undefined : true,
    role: title ? ("img" as const) : undefined,
  };
}

export function IconMenu({ className, title }: IconProps) {
  return (
    <svg {...baseProps(className, title)}>
      {title ? <title>{title}</title> : null}
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ className, title }: IconProps) {
  return (
    <svg {...baseProps(className, title)}>
      {title ? <title>{title}</title> : null}
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function IconSearch({ className, title }: IconProps) {
  return (
    <svg {...baseProps(className, title)}>
      {title ? <title>{title}</title> : null}
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconBag({ className, title }: IconProps) {
  return (
    <svg {...baseProps(className, title)}>
      {title ? <title>{title}</title> : null}
      <path
        d="M6 8h12l-1 12H7L6 8z"
        strokeLinejoin="round"
      />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronDown({ className, title }: IconProps) {
  return (
    <svg {...baseProps(className, title)}>
      {title ? <title>{title}</title> : null}
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
