"use client";

import Link from "next/link";
import {
  MetricCard,
  SectionLabel,
} from "@/components/dashboard/MetricCard";
import { MetricsCarousel } from "@/components/dashboard/MetricsCarousel";
import {
  AreaTrend,
  AnalyticsRow,
  BarChart,
  ChartCard,
  DonutChart,
  GaugeChart,
  InsightTile,
  LegendDots,
  StatList,
} from "@/components/dashboard/charts";
import {
  IconApps,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconUsers,
} from "@/components/dashboard/icons";
import { demoAnalytics, pct } from "@/lib/demo-analytics";

export default function AdminDashboardPage() {
  const d = demoAnalytics;

  return (
    <div className="pb-8">
      <SectionLabel>Key Metrics</SectionLabel>
      <MetricsCarousel>
        <MetricCard
          label="Total Employers"
          value={d.totalEmployers}
          tone="blue"
          href="/admin/employers"
          icon={<IconBuilding />}
        />
        <MetricCard
          label="Total Jobs"
          value={d.totalJobs}
          tone="orange"
          href="/admin/jobs"
          icon={<IconBriefcase />}
        />
        <MetricCard
          label="Total Sessions"
          value={d.totalSessions}
          tone="pink"
          icon={<IconCalendar />}
        />
        <MetricCard
          label="Total Placements"
          value={d.totalPlacements}
          tone="green"
          icon={<IconCheck />}
        />
      </MetricsCarousel>

      <div className="mt-8">
        <SectionLabel>Application Data</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ChartCard
            title="Employer Status (%)"
            href="/admin/employers"
            icon={<IconBuilding />}
            legend={
              <LegendDots
                items={d.employerStatus.map((s) => ({ label: s.label, color: s.color }))}
              />
            }
          >
            <DonutChart slices={d.employerStatus} />
          </ChartCard>

          <ChartCard
            title="Jobs Status (%)"
            href="/admin/jobs"
            icon={<IconBriefcase />}
            legend={
              <LegendDots items={d.jobStatus.map((s) => ({ label: s.label, color: s.color }))} />
            }
          >
            <DonutChart slices={d.jobStatus} />
          </ChartCard>

          <ChartCard
            title="Sessions (%)"
            icon={<IconCalendar />}
            legend={
              <LegendDots
                items={d.sessionStatus.map((s) => ({ label: s.label, color: s.color }))}
              />
            }
          >
            <GaugeChart
              value={0}
              max={100}
              centerLabel={d.totalSessions}
              color="#2f4d9a"
              label="Sessions"
              tooltip="0 counselling sessions"
            />
          </ChartCard>

          <ChartCard
            title="Placements"
            icon={<IconCheck />}
            legend={
              <LegendDots
                items={d.placementStatus.map((s) => ({ label: s.label, color: s.color }))}
              />
            }
          >
            <DonutChart slices={d.placementStatus} displayTotal={d.totalPlacements} />
          </ChartCard>
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#1b2a4a]">Application Trends</h3>
            <div className="inline-flex rounded-lg border border-[#e5ebf5] p-0.5 text-[12px]">
              <span className="rounded-md bg-[#2f4d9a] px-3 py-1 font-medium text-white">Chart</span>
              <span className="px-3 py-1 font-medium text-[#6b7c99]">Table</span>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat label="Jobs" value={d.totalJobs} color="#16a34a" />
            <MiniStat label="Seekers" value={d.jobsAndSeekers.jobSeekers} color="#2f4d9a" />
            <MiniStat label="Employers" value={d.totalEmployers} color="#f59e0b" />
            <MiniStat label="Hired" value={d.hiredThroughPortal} color="#db2777" />
          </div>
          <LegendDots
            items={[
              { label: "Jobs", color: "#f59e0b" },
              { label: "Seekers", color: "#db2777" },
              { label: "Applications", color: "#16a34a" },
            ]}
          />
          <div className="mt-3">
            <AreaTrend
              valueMultiplier={1000}
              series={[
                { label: "Jobs", color: "#f59e0b", points: d.yearTrend.jobs.map((n) => n / 1000) },
                {
                  label: "Seekers",
                  color: "#db2777",
                  points: d.yearTrend.seekers.map((n) => n / 1000),
                },
                {
                  label: "Applications",
                  color: "#16a34a",
                  points: d.yearTrend.applications.map((n) => n / 1000),
                },
              ]}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1b2a4a]">Analytics Overview</h3>
            <span className="text-[11px] font-medium text-[#6b7c99]">NAVTTC reports</span>
          </div>
          <DonutChart
            size={150}
            slices={[
              { label: "Gov", value: d.employers.government, color: "#2f4d9a" },
              { label: "Private", value: d.employers.private, color: "#f59e0b" },
              { label: "Foreign", value: d.employers.foreign, color: "#db2777" },
            ]}
          />
          <div className="mt-4">
            <StatList
              items={[
                {
                  label: "Gov employers",
                  value: d.employers.government,
                  color: "#2f4d9a",
                  pct: pct(d.employers.government, d.employers.government + d.employers.private + d.employers.foreign),
                },
                {
                  label: "Private employers",
                  value: d.employers.private,
                  color: "#f59e0b",
                  pct: pct(d.employers.private, d.employers.government + d.employers.private + d.employers.foreign),
                },
                {
                  label: "Foreign employers",
                  value: d.employers.foreign,
                  color: "#db2777",
                  pct: pct(d.employers.foreign, d.employers.government + d.employers.private + d.employers.foreign),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm">
          <AnalyticsRow
            title="All employers"
            rows={[
              { label: "Gov employers", value: d.employers.government },
              { label: "Private employers", value: d.employers.private },
              { label: "Foreign employers", value: d.employers.foreign },
            ]}
          />
        </div>
        <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm">
          <AnalyticsRow
            title="Jobs & job seekers"
            rows={[
              { label: "Jobs", value: d.jobsAndSeekers.jobs },
              { label: "Job seekers", value: d.jobsAndSeekers.jobSeekers },
            ]}
          />
        </div>
        <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm">
          <AnalyticsRow
            title="Placements"
            rows={[
              { label: "Placement centers", value: d.placements.centers },
              { label: "Placement officers", value: d.placements.officers },
            ]}
          />
        </div>
        <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm">
          <AnalyticsRow
            title="JPO activities"
            rows={[
              { label: "Industrial sessions", value: d.jpo.industrialSessions },
              { label: "Counselling sessions", value: d.jpo.counsellingSessions },
            ]}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Trade wise jobs" icon={<IconApps />}>
          <p className="mb-3 text-[12px] text-[#6b7c99]">Distribution by trade title</p>
          <BarChart bars={d.tradeWiseJobs} />
        </ChartCard>
        <ChartCard title="Qualification wise jobs" icon={<IconApps />}>
          <p className="mb-3 text-[12px] text-[#6b7c99]">Jobs grouped by qualification type</p>
          <DonutChart slices={d.qualificationWise} size={150} />
          <div className="mt-3">
            <StatList
              items={d.qualificationWise.map((q) => ({
                ...q,
                pct: pct(
                  q.value,
                  d.qualificationWise.reduce((s, x) => s + x.value, 0)
                ),
              }))}
            />
          </div>
        </ChartCard>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Gender-wise jobs" icon={<IconUsers />}>
          <p className="mb-3 text-[12px] text-[#6b7c99]">Breakdown by gender quota</p>
          <DonutChart slices={d.genderWise} size={150} />
          <div className="mt-3">
            <LegendDots items={d.genderWise.map((g) => ({ label: g.label, color: g.color }))} />
          </div>
        </ChartCard>
        <ChartCard title="Region-wise jobs" icon={<IconBuilding />}>
          <p className="mb-3 text-[12px] text-[#6b7c99]">Jobs by place of posting</p>
          <BarChart
            bars={d.regionWise.map((r) => ({
              label: r.label,
              value: r.value,
              color: r.color,
            }))}
          />
        </ChartCard>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Province wise job seekers" icon={<IconUsers />}>
          <p className="mb-3 text-[12px] text-[#6b7c99]">Domicile-wise distribution</p>
          <BarChart
            bars={d.provinceSeekers.map((p, i) => ({
              ...p,
              color: ["#2f4d9a", "#16a34a", "#f59e0b", "#db2777", "#0d9488"][i],
            }))}
          />
        </ChartCard>
        <ChartCard title="Top employers" icon={<IconBuilding />} href="/admin/employers">
          <p className="mb-3 text-[12px] text-[#6b7c99]">Organizations by jobs posted</p>
          <DonutChart
            slices={d.topEmployers.map((t) => ({
              label: t.label,
              value: t.value,
              color: t.color,
            }))}
            size={150}
          />
          <div className="mt-3">
            <AnalyticsRow title="All organizations" rows={d.orgByJobs} />
          </div>
        </ChartCard>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Trades with highest pay" icon={<IconBriefcase />}>
          <p className="mb-3 text-[12px] text-[#6b7c99]">In USD</p>
          <BarChart
            bars={d.highestPayTrades.map((t) => ({
              label: t.label,
              value: t.value,
              color: "#2f4d9a",
            }))}
            height={200}
          />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniStat label="Overall jobs" value={`$${d.salaryScope.overall}`} color="#2f4d9a" />
            <MiniStat label="Foreign jobs" value={`$${d.salaryScope.foreign}`} color="#f59e0b" />
            <MiniStat label="Local jobs" value={`$${d.salaryScope.local}`} color="#16a34a" />
          </div>
        </ChartCard>
        <ChartCard title="Top trades average salary" icon={<IconBriefcase />}>
          <p className="mb-3 text-[12px] text-[#6b7c99]">In USD</p>
          <StatList
            items={d.highestPayTrades.map((t, i) => ({
              label: t.label,
              value: `$${t.value}`,
              color: ["#2f4d9a", "#16a34a", "#f59e0b", "#db2777", "#0d9488"][i],
              pct: pct(t.value, d.highestPayTrades[0].value),
            }))}
          />
          <p className="mt-4 text-[12px] text-[#6b7c99]">
            JobSeeker hired through portal:{" "}
            <strong className="text-[#1b2a4a]">{d.hiredThroughPortal}</strong>
          </p>
        </ChartCard>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-[#1b2a4a]">Year wise trend</h3>
          <p className="mb-3 text-[12px] text-[#6b7c99]">Monthly activity across the demo year</p>
          <AreaTrend
            height={220}
            valueMultiplier={1000}
            series={[
              { label: "Jobs", color: "#2f4d9a", points: d.yearTrend.jobs.map((n) => n / 1000) },
              {
                label: "Seekers",
                color: "#16a34a",
                points: d.yearTrend.seekers.map((n) => n / 1000),
              },
            ]}
          />
        </div>
        <ChartCard title="Jobs posted by" icon={<IconApps />}>
          <p className="mb-3 text-[12px] text-[#6b7c99]">NSIS, employer, and API</p>
          <DonutChart slices={d.jobsPostedBy} size={150} />
          <div className="mt-3">
            <StatList
              items={d.jobsPostedBy.map((j) => ({
                ...j,
                pct: pct(
                  j.value,
                  d.jobsPostedBy.reduce((s, x) => s + x.value, 0)
                ),
              }))}
            />
          </div>
        </ChartCard>
      </div>

      <div className="mt-8">
        <SectionLabel>More Insights</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InsightTile
            title="Trade wise jobs"
            description="Distribution by trade title across active and historical postings."
          />
          <InsightTile
            title="Qualification wise jobs"
            description="Jobs grouped by qualification type for matching seekers."
          />
          <InsightTile
            title="Gender-wise jobs"
            description="Breakdown by gender quota for inclusive hiring visibility."
          />
          <InsightTile
            title="Region-wise jobs"
            description="Jobs by place of posting across provinces and regions."
          />
        </div>
      </div>

    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-[#eef2f7] bg-[#f8fafc] px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        <span className="text-[11px] text-[#6b7c99]">{label}</span>
      </div>
      <p className="mt-1 text-sm font-bold text-[#1b2a4a]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
