"use client";

import {
  Children,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

function useVisibleSlots() {
  const [slots, setSlots] = useState(4);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setSlots(1);
      else if (w < 1280) setSlots(2);
      else setSlots(4);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return slots;
}

export function MetricsCarousel({
  children,
  intervalMs = 3000,
}: {
  children: ReactNode;
  intervalMs?: number;
}) {
  const items = useMemo(
    () => Children.toArray(children).filter(Boolean),
    [children]
  );
  const slots = useVisibleSlots();
  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, items.length - slots);
  const shouldRotate = items.length > slots;

  useEffect(() => {
    setStart(0);
  }, [slots, items.length]);

  useEffect(() => {
    if (!shouldRotate) return;
    const id = window.setInterval(() => {
      setStart((s) => (s >= maxStart ? 0 : s + 1));
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [shouldRotate, maxStart, intervalMs]);

  const visible = useMemo(() => {
    if (items.length === 0) return [];
    if (!shouldRotate) return items;
    return items.slice(start, start + slots);
  }, [items, shouldRotate, start, slots]);

  const colsClass =
    slots === 1
      ? "grid-cols-1"
      : slots === 2
        ? "grid-cols-2"
        : "grid-cols-4";

  return (
    <div className={`grid gap-4 ${colsClass}`}>
      {visible.map((child, i) => (
        <div key={`${start}-${i}`} className="min-w-0 transition duration-300 ease-out">
          {child}
        </div>
      ))}
    </div>
  );
}
