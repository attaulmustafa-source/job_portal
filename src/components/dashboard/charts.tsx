"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

export type Slice = {
  label: string;
  value: number;
  color: string;
  /** Optional custom hover text, e.g. "4 jobs available" */
  tooltip?: string;
};

type Tip = { label: string; value: string; color: string; x: number; y: number };

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, end);
  const e = polar(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

function ChartTooltip({ tip }: { tip: Tip | null }) {
  if (!tip) return null;
  return (
    <div
      className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-md bg-[#1b2433] px-2.5 py-1.5 text-[12px] font-medium text-white shadow-lg"
      style={{ left: tip.x, top: tip.y }}
    >
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ background: tip.color }}
        />
        <span>
          {tip.label}: {tip.value}
        </span>
      </span>
      <span className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-4 border-transparent border-t-[#1b2433]" />
    </div>
  );
}

function formatValue(value: number | string) {
  return typeof value === "number" ? value.toLocaleString() : value;
}

export function DonutChart({
  slices,
  totalLabel = "Total",
  size = 160,
  thickness = 18,
  displayTotal,
}: {
  slices: Slice[];
  totalLabel?: string;
  size?: number;
  thickness?: number;
  displayTotal?: number;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const rawTotal = slices.reduce((s, x) => s + x.value, 0);
  const total = rawTotal || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - thickness / 2 - 4;
  let angle = 0;

  const segments = slices
    .filter((slice) => slice.value > 0)
    .map((slice) => {
      const span = (slice.value / total) * 360;
      const start = angle;
      const end = angle + Math.max(span, 0.8);
      const mid = (start + end) / 2;
      angle = end;
      return { ...slice, start, end, mid };
    });

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      onMouseLeave={() => {
        setTip(null);
        setActive(null);
      }}
    >
      <ChartTooltip tip={tip} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#eef2f7" strokeWidth={thickness} />
        {rawTotal > 0
          ? segments.map((slice) => {
              const isActive = active === slice.label;
              const showTip = (e: React.MouseEvent<SVGPathElement>) => {
                const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                setActive(slice.label);
                setTip({
                  label: slice.label,
                  value: slice.tooltip || formatValue(slice.value),
                  color: slice.color,
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              };
              return (
                <g key={slice.label}>
                  <path
                    d={arcPath(cx, cy, r, slice.start, slice.end)}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={isActive ? thickness + 4 : thickness}
                    strokeLinecap="butt"
                    className="pointer-events-none transition-[stroke-width]"
                  />
                  <path
                    d={arcPath(cx, cy, r, slice.start, slice.end)}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={thickness + 14}
                    strokeLinecap="butt"
                    className="cursor-pointer"
                    onMouseEnter={showTip}
                    onMouseMove={showTip}
                  />
                </g>
              );
            })
          : null}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[11px] text-[#8a94a6]">{totalLabel}</p>
        <p className="text-xl font-bold text-[#1b2a4a]">
          {(displayTotal ?? rawTotal).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export function GaugeChart({
  value,
  max = 100,
  color = "#2f4d9a",
  centerLabel,
  size = 160,
  label = "Progress",
  tooltip,
}: {
  value: number;
  max?: number;
  color?: string;
  centerLabel: string | number;
  size?: number;
  label?: string;
  tooltip?: string;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const sweep = (pct / 100) * 180;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = size / 2 - 18;

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size * 0.72 }}
      onMouseLeave={() => setTip(null)}
    >
      <ChartTooltip tip={tip} />
      <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`}>
        <path
          d={arcPath(cx, cy, r, 180, 360)}
          fill="none"
          stroke="#eef2f7"
          strokeWidth={16}
          strokeLinecap="round"
        />
        <path
          d={arcPath(cx, cy, r, 180, 180 + Math.max(sweep, 1))}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
          className="cursor-pointer"
          opacity={sweep > 0 ? 1 : 0.35}
          onMouseEnter={(e) => {
            const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
            setTip({
              label,
              value: tooltip || `${formatValue(value)} / ${formatValue(max)}`,
              color,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
          onMouseMove={(e) => {
            const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
            setTip({
              label,
              value: tooltip || `${formatValue(value)} / ${formatValue(max)}`,
              color,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center">
        <p className="text-[11px] text-[#8a94a6]">Total</p>
        <p className="text-xl font-bold text-[#1b2a4a]">{centerLabel}</p>
      </div>
    </div>
  );
}

export function ChartCard({
  title,
  icon,
  href,
  children,
  legend,
}: {
  title: string;
  icon?: ReactNode;
  href?: string;
  children: ReactNode;
  legend?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[#1b2a4a]">
          {icon ? <span className="text-[#2f4d9a]">{icon}</span> : null}
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        {href ? (
          <Link href={href} className="text-[12px] font-medium text-[#6b7c99] hover:text-[#2f4d9a]">
            View All →
          </Link>
        ) : null}
      </div>
      {children}
      {legend ? <div className="mt-4">{legend}</div> : null}
    </div>
  );
}

export function LegendDots({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-[#5b6b85]">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function StatList({
  items,
}: {
  items: { label: string; value: number | string; color: string; pct?: number }[];
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between gap-2 text-[13px]">
            <span className="inline-flex items-center gap-2 text-[#5b6b85]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
              {item.label}
            </span>
            <span className="font-semibold text-[#1b2a4a]">
              {typeof item.pct === "number" ? `${item.pct.toFixed(1)}%` : null}{" "}
              <span className="font-normal text-[#8a94a6]">
                ({typeof item.value === "number" ? item.value.toLocaleString() : item.value})
              </span>
            </span>
          </div>
          {typeof item.pct === "number" ? (
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#eef2f7]">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(100, item.pct)}%`, background: item.color }}
              />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function BarChart({
  bars,
  height = 180,
}: {
  bars: { label: string; value: number; color?: string; tooltip?: string }[];
  height?: number;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div
      className="relative flex items-end gap-3"
      style={{ height }}
      onMouseLeave={() => setTip(null)}
    >
      <ChartTooltip tip={tip} />
      {bars.map((bar) => (
        <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-[11px] font-semibold text-[#1b2a4a]">
            {bar.value.toLocaleString()}
          </span>
          <div className="flex w-full flex-1 items-end rounded-md bg-[#f5f8fc] px-1.5 pb-0 pt-2">
            <div
              className="w-full cursor-pointer rounded-t-md transition opacity-95 hover:opacity-100"
              style={{
                height: `${(bar.value / max) * 100}%`,
                minHeight: bar.value > 0 ? 8 : 0,
                background: bar.color || "#2f4d9a",
              }}
              onMouseEnter={(e) => {
                const parent = e.currentTarget.closest(".relative") as HTMLElement;
                const rect = parent.getBoundingClientRect();
                setTip({
                  label: bar.label,
                  value: bar.tooltip || formatValue(bar.value),
                  color: bar.color || "#2f4d9a",
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
              onMouseMove={(e) => {
                const parent = e.currentTarget.closest(".relative") as HTMLElement;
                const rect = parent.getBoundingClientRect();
                setTip({
                  label: bar.label,
                  value: bar.tooltip || formatValue(bar.value),
                  color: bar.color || "#2f4d9a",
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
            />
          </div>
          <span className="text-center text-[10px] leading-tight text-[#6b7c99]">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AreaTrend({
  series,
  height = 200,
  pointLabels,
  valueMultiplier = 1,
}: {
  series: { label: string; color: string; points: number[] }[];
  height?: number;
  pointLabels?: string[];
  /** Multiply chart point values in tooltip (e.g. 1000 when chart uses scaled points) */
  valueMultiplier?: number;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  const w = 560;
  const h = height;
  const pad = 20;
  const all = series.flatMap((s) => s.points);
  const max = Math.max(...all, 1);
  const len = Math.max(...series.map((s) => s.points.length), 2);
  const months =
    pointLabels ||
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function path(points: number[], close = false) {
    const coords = points.map((v, i) => {
      const x = pad + (i / (len - 1)) * (w - pad * 2);
      const y = h - pad - (v / max) * (h - pad * 2);
      return `${x},${y}`;
    });
    const line = `M ${coords.join(" L ")}`;
    if (!close) return line;
    const lastX = pad + ((points.length - 1) / (len - 1)) * (w - pad * 2);
    return `${line} L ${lastX},${h - pad} L ${pad},${h - pad} Z`;
  }

  return (
    <div className="relative" onMouseLeave={() => setTip(null)}>
      <ChartTooltip tip={tip} />
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full overflow-visible">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={pad}
            x2={w - pad}
            y1={h - pad - g * (h - pad * 2)}
            y2={h - pad - g * (h - pad * 2)}
            stroke="#eef2f7"
            strokeWidth="1"
          />
        ))}
        {series.map((s) => (
          <g key={s.label}>
            <path d={path(s.points, true)} fill={s.color} opacity="0.18" />
            <path
              d={path(s.points)}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {s.points.map((v, i) => {
              const x = pad + (i / (len - 1)) * (w - pad * 2);
              const y = h - pad - (v / max) * (h - pad * 2);
              return (
                <circle
                  key={`${s.label}-${i}`}
                  cx={x}
                  cy={y}
                  r={5}
                  fill={s.color}
                  className="cursor-pointer"
                  opacity={0.001}
                  onMouseEnter={(e) => {
                    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                    const scaleX = rect.width / w;
                    const scaleY = rect.height / h;
                    setTip({
                      label: `${s.label} (${months[i] || i + 1})`,
                      value: formatValue(Math.round(v * valueMultiplier)),
                      color: s.color,
                      x: x * scaleX,
                      y: y * scaleY,
                    });
                  }}
                />
              );
            })}
            {s.points.map((v, i) => {
              const x = pad + (i / (len - 1)) * (w - pad * 2);
              const y = h - pad - (v / max) * (h - pad * 2);
              return (
                <circle
                  key={`${s.label}-vis-${i}`}
                  cx={x}
                  cy={y}
                  r={3.5}
                  fill="#fff"
                  stroke={s.color}
                  strokeWidth="2"
                  className="pointer-events-none"
                />
              );
            })}
          </g>
        ))}
      </svg>
      <div className="mt-1 flex justify-between px-1 text-[10px] text-[#8a94a6]">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsRow({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number | string }[];
}) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#8a94a6]">
        {title}
      </p>
      <ul className="space-y-1.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between text-[13px]">
            <span className="text-[#5b6b85]">{row.label}</span>
            <span className="font-semibold text-[#1b2a4a]">
              {typeof row.value === "number" ? row.value.toLocaleString() : row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InsightTile({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[#e5ebf5] bg-white p-4 shadow-sm transition hover:shadow-md">
      <h3 className="text-sm font-semibold text-[#1b2a4a]">{title}</h3>
      <p className="mt-1 text-[12px] leading-relaxed text-[#6b7c99]">{description}</p>
    </div>
  );
}
