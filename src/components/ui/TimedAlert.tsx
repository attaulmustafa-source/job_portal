"use client";

import { useEffect } from "react";
import { Alert } from "@/components/ui/Alert";

type Tone = "info" | "success" | "warning" | "danger";

export function TimedAlert({
  message,
  tone = "warning",
  durationMs = 10000,
  onHide,
}: {
  message: string | null;
  tone?: Tone;
  durationMs?: number;
  onHide: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => onHide(), durationMs);
    return () => window.clearTimeout(id);
  }, [message, durationMs, onHide]);

  if (!message) return null;

  return (
    <div className="mb-4">
      <Alert tone={tone}>{message}</Alert>
    </div>
  );
}
