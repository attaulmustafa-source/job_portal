export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const styles = {
    neutral: "bg-gray-100 text-foreground",
    success: "bg-green-50 text-success",
    warning: "bg-amber-50 text-warning",
    danger: "bg-red-50 text-danger",
    info: "bg-primary-soft text-primary",
  } as const;

  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium leading-tight ${styles[tone]}`}>
      {label}
    </span>
  );
}

export function jobStatusTone(status: string) {
  if (status === "published") return "success" as const;
  if (status === "expired") return "danger" as const;
  if (status === "unpublished" || status === "draft") return "warning" as const;
  return "neutral" as const;
}

export function appStatusTone(status: string) {
  if (status === "Selected" || status === "Shortlisted") return "success" as const;
  if (status === "Rejected") return "danger" as const;
  if (status === "Interview Scheduled") return "info" as const;
  if (status === "Under Review") return "warning" as const;
  return "neutral" as const;
}
