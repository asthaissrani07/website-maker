"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDisplayDate, formatMonthShort, startOfUtcDay } from "@/lib/format-date";
import { getProductTheme } from "@/lib/product-themes";
import type { ProductSiteConfig } from "@/lib/types";
import { DashboardCard } from "./DashboardCard";

const CHART_COLORS = [
  "#5A2D82",
  "#F59E0B",
  "#14B8A6",
  "#94A3B8",
  "#EC4899",
  "#3B82F6",
  "#8B5CF6",
];

function useAnimatedValue(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function DonutChart({
  segments,
  total,
}: {
  segments: { label: string; value: number; color: string }[];
  total: number;
}) {
  const animatedTotal = useAnimatedValue(total);
  let offset = 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="16"
          />
          {segments.map((seg, i) => {
            const pct = total > 0 ? seg.value / total : 0;
            const dash = pct * circumference;
            const circle = (
              <circle
                key={seg.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="chart-segment"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Total Sites
          </div>
          <div className="text-2xl font-bold text-slate-800">{animatedTotal}</div>
        </div>
      </div>
      <ul className="space-y-2 text-xs">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2">
            <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-slate-600">{seg.label}</span>
            <span className="ml-auto font-medium text-slate-800">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HorizontalBarChart({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-600">{item.label}</span>
            <span className="font-medium text-slate-800">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="chart-bar h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
                animationDelay: `${i * 100}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LineChart({
  labels,
  series,
}: {
  labels: string[];
  series: { name: string; color: string; data: number[] }[];
}) {
  const max = Math.max(...series.flatMap((s) => s.data), 1);
  const width = 280;
  const height = 120;
  const pad = 8;

  function points(data: number[]) {
    return data
      .map((v, i) => {
        const x = pad + (i / Math.max(data.length - 1, 1)) * (width - pad * 2);
        const y = height - pad - (v / max) * (height - pad * 2);
        return `${x},${y}`;
      })
      .join(" ");
  }

  return (
    <div>
      <div className="mb-3 flex gap-4 text-xs">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5 text-slate-600">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={pad}
            y1={height - pad - pct * (height - pad * 2)}
            x2={width - pad}
            y2={height - pad - pct * (height - pad * 2)}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        ))}
        {series.map((s) => (
          <polyline
            key={s.name}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points(s.data)}
            className="chart-line"
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function AreaChart({ labels, data }: { labels: string[]; data: number[] }) {
  const max = Math.max(...data, 1);
  const width = 280;
  const height = 100;
  const pad = 8;

  const coords = data.map((v, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (width - pad * 2);
    const y = height - pad - (v / max) * (height - pad * 2);
    return { x, y };
  });

  const line = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const area = `${coords[0]?.x ?? pad},${height - pad} ${line} ${coords[coords.length - 1]?.x ?? width - pad},${height - pad}`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5A2D82" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#5A2D82" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#areaGrad)" className="chart-area" />
        <polyline
          fill="none"
          stroke="#5A2D82"
          strokeWidth="2.5"
          strokeLinecap="round"
          points={line}
          className="chart-line"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function FunnelChart({
  stages,
}: {
  stages: { label: string; value: number; sub: string }[];
}) {
  const max = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="space-y-2">
      {stages.map((stage, i) => {
        const widthPct = 40 + (stage.value / max) * 60;
        return (
          <div
            key={stage.label}
            className="chart-funnel mx-auto transition-all duration-700"
            style={{
              width: `${widthPct}%`,
              animationDelay: `${i * 100}ms`,
            }}
          >
            <div
              className="rounded-md px-3 py-2 text-center text-white"
              style={{
                backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                opacity: 0.85 + (i * 0.03),
              }}
            >
              <div className="text-xs font-medium">{stage.label}</div>
              <div className="text-[10px] opacity-90">{stage.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SiteList({
  sites,
  limit = 5,
}: {
  sites: ProductSiteConfig[];
  limit?: number;
}) {
  const items = sites.slice(0, limit);

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">No sites yet</p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((site) => (
        <li key={site.id}>
          <Link
            href={`/sites/${site.id}`}
            className="group flex items-center justify-between py-3 transition hover:bg-slate-50 -mx-2 px-2 rounded-lg"
          >
            <div>
              <div className="text-sm font-medium text-slate-800 group-hover:text-purple-700">
                {site.brandName}
              </div>
              <div className="text-xs text-slate-500">{site.productName}</div>
            </div>
            <span className="text-xs font-medium text-emerald-600">${site.price}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function groupByTheme(sites: ProductSiteConfig[]) {
  const map = new Map<string, number>();
  for (const site of sites) {
    const theme = getProductTheme(site.themeId).name;
    map.set(theme, (map.get(theme) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({
      label,
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
}

function sitesByMonth(sites: ProductSiteConfig[], referenceIso: string, months = 6) {
  const now = startOfUtcDay(new Date(referenceIso));
  const labels: string[] = [];
  const counts: number[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    labels.push(formatMonthShort(d));
    counts.push(
      sites.filter((s) => {
        const created = new Date(s.createdAt);
        return (
          created.getUTCMonth() === d.getUTCMonth() &&
          created.getUTCFullYear() === d.getUTCFullYear()
        );
      }).length,
    );
  }

  return { labels, counts };
}

function sitesByWeek(sites: ProductSiteConfig[], referenceIso: string) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = startOfUtcDay(new Date(referenceIso));
  const counts = days.map((_, i) => {
    const d = new Date(now);
    d.setUTCDate(now.getUTCDate() - (6 - i));
    const dayStart = startOfUtcDay(d).getTime();
    return sites.filter((s) => startOfUtcDay(new Date(s.createdAt)).getTime() === dayStart).length;
  });
  return { labels: days, counts };
}

export function DashboardCharts({
  sites,
  generatedAt,
}: {
  sites: ProductSiteConfig[];
  generatedAt: string;
}) {
  const themeSegments = useMemo(() => groupByTheme(sites), [sites]);
  const { labels: monthLabels, counts: monthCounts } = useMemo(
    () => sitesByMonth(sites, generatedAt),
    [sites, generatedAt],
  );
  const { labels: weekLabels, counts: weekCounts } = useMemo(
    () => sitesByWeek(sites, generatedAt),
    [sites, generatedAt],
  );

  const avgPrice =
    sites.length > 0
      ? sites.reduce((sum, s) => sum + parseFloat(s.price || "0"), 0) / sites.length
      : 0;

  const priceRanges = [
    { label: "Under $25", value: sites.filter((s) => parseFloat(s.price) < 25).length, color: "#3B82F6" },
    { label: "$25 – $50", value: sites.filter((s) => { const p = parseFloat(s.price); return p >= 25 && p < 50; }).length, color: "#F59E0B" },
    { label: "$50 – $100", value: sites.filter((s) => { const p = parseFloat(s.price); return p >= 50 && p < 100; }).length, color: "#14B8A6" },
    { label: "$100+", value: sites.filter((s) => parseFloat(s.price) >= 100).length, color: "#5A2D82" },
  ].filter((r) => r.value > 0);

  const funnelStages = [
    { label: "Total Built", value: sites.length, sub: `${sites.length} sites` },
    { label: "With Images", value: sites.filter((s) => s.imageBase64).length, sub: "Custom product photos" },
    { label: "AI Generated", value: sites.filter((s) => s.heroHeadline).length, sub: "Full copy ready" },
    { label: "Ready to Deploy", value: sites.length, sub: "Download ZIP available" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-3">
        <DashboardCard title="Sites by Theme" filter="All time" delay={0}>
          {sites.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Create your first site to see theme breakdown
            </p>
          ) : (
            <DonutChart segments={themeSegments} total={sites.length} />
          )}
        </DashboardCard>

        <DashboardCard title="Sites by Price Range" filter="All sites" delay={80}>
          {priceRanges.length === 0 ? (
            <HorizontalBarChart
              items={[
                { label: "No data yet", value: 0, color: "#94A3B8" },
              ]}
            />
          ) : (
            <HorizontalBarChart items={priceRanges} />
          )}
        </DashboardCard>

        <DashboardCard title="Build Trend" filter="Last 6 months" delay={160}>
          <LineChart
            labels={monthLabels}
            series={[
              { name: "Sites Built", color: "#5A2D82", data: monthCounts },
              {
                name: "Avg / month",
                color: "#14B8A6",
                data: monthCounts.map(() =>
                  Math.round(monthCounts.reduce((a, b) => a + b, 0) / Math.max(monthCounts.length, 1)),
                ),
              },
            ]}
          />
        </DashboardCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashboardCard title="Weekly Activity" filter="Last 7 days" delay={240}>
          <AreaChart labels={weekLabels} data={weekCounts} />
        </DashboardCard>

        <DashboardCard title="Build Pipeline" delay={320}>
          <FunnelChart stages={funnelStages} />
        </DashboardCard>

        <DashboardCard
          title="Recent Sites"
          count={sites.length}
          delay={400}
          footer={
            sites.length > 0 ? (
              <Link
                href="/create"
                className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 hover:text-purple-900"
              >
                View all
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            ) : undefined
          }
        >
          <SiteList sites={sites} />
        </DashboardCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashboardCard title="Quick Stats" delay={480}>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-purple-50 p-4">
              <p className="text-2xl font-bold text-purple-800">{sites.length}</p>
              <p className="text-xs text-purple-600">Total sites</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-2xl font-bold text-emerald-800">
                ${avgPrice.toFixed(0)}
              </p>
              <p className="text-xs text-emerald-600">Avg price</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-2xl font-bold text-amber-800">
                {themeSegments.length}
              </p>
              <p className="text-xs text-amber-600">Themes used</p>
            </div>
            <div className="rounded-lg bg-sky-50 p-4">
              <p className="text-2xl font-bold text-sky-800">
                {sites.filter((s) => s.imageBase64).length}
              </p>
              <p className="text-xs text-sky-600">With images</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Recent Activity"
          count={Math.min(sites.length, 5)}
          delay={560}
          footer={
            <Link
              href="/create"
              className="admin-btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-white transition hover:scale-[1.02]"
            >
              + New Site
            </Link>
          }
        >
          {sites.length === 0 ? (
            <p className="py-4 text-sm text-slate-400">No activity yet</p>
          ) : (
            <ul className="space-y-3">
              {sites.slice(0, 5).map((site) => (
                <li key={site.id} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
                  <div>
                    <div className="text-sm text-slate-700">
                      Built <strong>{site.brandName}</strong>
                    </div>
                    <time
                      dateTime={site.createdAt}
                      className="mt-0.5 block text-xs text-slate-500"
                    >
                      {formatDisplayDate(site.createdAt)}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard title="Themes" count={themeSegments.length} delay={640}>
          {themeSegments.length === 0 ? (
            <p className="py-4 text-sm text-slate-400">No themes in use</p>
          ) : (
            <ul className="space-y-2">
              {themeSegments.map((t) => (
                <li
                  key={t.label}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    {t.label}
                  </span>
                  <span className="font-medium text-slate-700">{t.value}</span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}
