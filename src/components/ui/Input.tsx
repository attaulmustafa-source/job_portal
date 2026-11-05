import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, id, className = "", ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block space-y-1.5 text-sm text-foreground" htmlFor={inputId}>
      <span className="font-medium">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-md border border-border bg-white px-3 py-2 text-foreground outline-none focus:border-primary ${className}`}
        {...props}
      />
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
      {error ? <span className="block text-xs text-danger">{error}</span> : null}
    </label>
  );
}
