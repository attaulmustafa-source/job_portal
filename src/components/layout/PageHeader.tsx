import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold leading-tight text-[#1b2a4a] sm:text-xl">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-xs text-[#6b7c99] sm:text-sm">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-1.5">{actions}</div> : null}
    </header>
  );
}
