import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "landing"
  | "landingSecondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
}

const styles: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover border-transparent",
  secondary: "bg-white text-foreground border-border hover:bg-primary-soft",
  danger: "bg-danger text-white hover:opacity-90 border-transparent",
  ghost: "bg-transparent text-foreground border-transparent hover:bg-primary-soft",
  landing:
    "bg-primary text-white border-transparent transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:!text-[#1b2a4a] hover:border-[#2f4d9a]",
  landingSecondary:
    "bg-white text-foreground border-border transition-all duration-300 hover:-translate-y-1 hover:bg-[#2f4d9a] hover:!text-white hover:border-[#2f4d9a]",
};

export function Button({
  children,
  variant = "primary",
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
