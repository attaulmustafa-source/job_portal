import type { ReactNode } from "react";
import Link from "next/link";

export type MetricTone = "blue" | "orange" | "green" | "pink" | "red" | "teal" | "purple";

const tones: Record<
  MetricTone,
  { bar: string; iconBg: string; iconText: string; delta: string }
> = {
  blue: {
    bar: "bg-[#2f4d9a]",
    iconBg: "bg-[#e8eefc]",
    iconText: "text-[#2f4d9a]",
    delta: "text-[#2f4d9a]",
  },
  orange: {
    bar: "bg-[#f59e0b]",
    iconBg: "bg-[#fff7e8]",
    iconText: "text-[#d97706]",
    delta: "text-[#d97706]",
  },
  green: {
    bar: "bg-[#16a34a]",
    iconBg: "bg-[#eaf8ef]",
    iconText: "text-[#16a34a]",
    delta: "text-[#16a34a]",
  },
  pink: {
    bar: "bg-[#db2777]",
    iconBg: "bg-[#fce7f3]",
    iconText: "text-[#db2777]",
    delta: "text-[#db2777]",
  },
  red: {
    bar: "bg-[#dc2626]",
    iconBg: "bg-[#fee2e2]",
    iconText: "text-[#dc2626]",
    delta: "text-[#dc2626]",
  },
  teal: {
    bar: "bg-[#0d9488]",
    iconBg: "bg-[#e6f7f5]",
    iconText: "text-[#0d9488]",
    delta: "text-[#0d9488]",
  },
  purple: {
    bar: "bg-[#7c3aed]",
    iconBg: "bg-[#f3e8ff]",
    iconText: "text-[#7c3aed]",
    delta: "text-[#7c3aed]",
  },
};

export function MetricCard({
  label,
  value,
  icon,
  tone = "blue",
  href,
  hint = "▲ 0.0%",
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: MetricTone;
  href?: string;
  hint?: string;
}) {
  const t = tones[tone];
  const display =
    typeof value === "number" ? value.toLocaleString() : value;
  const body = (
    <div className="relative overflow-hidden rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.iconBg} ${t.iconText}`}
        >
          {icon}
        </div>
        {hint ? (
          <span className="text-[11px] font-semibold text-[#16a34a]">{hint}</span>
        ) : null}
      </div>
      <p className="mt-4 text-[28px] font-bold leading-none text-[#1b2a4a]">{display}</p>
      <p className="mt-2 text-[13px] font-medium text-[#6b7c99]">{label}</p>
      <div className={`absolute inset-x-0 bottom-0 h-[3px] ${t.bar}`} />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}

export function DashboardWelcome({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const now = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[26px] font-bold leading-tight text-[#1b2a4a]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-[#6b7c99]">{subtitle}</p> : null}
        <p className="mt-2 flex items-center gap-2 text-[12px] text-[#6b7c99]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#16a34a]" />
          Live · Updated just now · {now}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a94a6]">
        {children}
      </p>
      <div className="h-px min-w-0 flex-1 bg-[#e5ebf5]" aria-hidden />
    </div>
  );
}
