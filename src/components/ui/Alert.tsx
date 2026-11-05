import type { ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  info: "border-primary bg-primary-soft text-foreground",
  success: "border-success/30 bg-green-50 text-foreground",
  warning: "border-warning/40 bg-amber-50 text-foreground",
  danger: "border-danger/30 bg-red-50 text-foreground",
};

export function Alert({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <div className={`rounded-md border px-3 py-2 text-sm ${tones[tone]}`}>{children}</div>
  );
}
