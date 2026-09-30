"use client";
import { cn } from "@/lib/utils";

export function LineChart({
  data, height = 200, className, stroke = "#4f46e5", fill = "rgba(79,70,229,0.12)",
}: {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
  stroke?: string;
  fill?: string;
}) {
  const w = 600;
  const h = height;
  const pad = 24;
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const step = (w - pad * 2) / (data.length - 1);
  const points = data.map((d, i) => [pad + i * step, h - pad - (d.value / max) * (h - pad * 2)]);
  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${path} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("w-full", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={pad} x2={w - pad} y1={pad + i * ((h - pad * 2) / 3)} y2={pad + i * ((h - pad * 2) / 3)}
          stroke="#e2e8f0" strokeDasharray="4 6" strokeWidth={1} />
      ))}
      <path d={area} fill="url(#lg)" />
      <path d={path} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill="#fff" stroke={stroke} strokeWidth={2} />
      ))}
      {data.map((d, i) => (
        <text key={i} x={pad + i * step} y={h - 6} textAnchor="middle" className="fill-slate-400" fontSize={11}>
          {d.label}
        </text>
      ))}
    </svg>
  );
}

export function BarChart({
  data, height = 200, className, color = "#4f46e5",
}: { data: { label: string; value: number }[]; height?: number; className?: string; color?: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className={cn("flex items-end gap-2", className)} style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
              style={{ height: `${(d.value / max) * 100}%`, background: color }}
            />
          </div>
          <span className="text-[11px] font-medium text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}