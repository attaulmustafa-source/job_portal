export function OrgLogo({
  name,
  logoUrl,
  size = "md",
}: {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={`${sizeClass} rounded-md border border-border object-cover bg-white`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-md border border-border bg-primary-soft font-semibold text-primary`}
      aria-hidden
    >
      {initials || "ORG"}
    </div>
  );
}
