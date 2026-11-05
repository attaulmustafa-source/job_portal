"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  MetricCard,
  SectionLabel,
} from "@/components/dashboard/MetricCard";
import { MetricsCarousel } from "@/components/dashboard/MetricsCarousel";
import {
  ChartCard,
  DonutChart,
  LegendDots,
} from "@/components/dashboard/charts";
import {
  IconApps,
  IconBell,
  IconBriefcase,
  IconCheck,
  IconClock,
  IconStar,
} from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-store";
import { isJobActive } from "@/lib/jobs";
import { employerReadyForApproval } from "@/lib/profile";

export default function EmployerDashboardPage() {
  const { user, jobs, applications, notifications, submitEmployerApproval } = useAuth();
  const myJobs = jobs.filter((j) => j.employerId === user?.id);
  const activeJobs = myJobs.filter(isJobActive).length;
  const expiredJobs = myJobs.filter((j) => j.status === "expired").length;
  const myJobIds = new Set(myJobs.map((j) => j.id));
  const applicants = applications.filter((a) => myJobIds.has(a.jobId));
  const shortlisted = applicants.filter((a) => a.status === "Shortlisted").length;
  const pendingApps = applicants.filter(
    (a) => a.status === "Applied" || a.status === "Under Review"
  ).length;
  const selected = applicants.filter((a) => a.status === "Selected").length;
  const unread = notifications.filter((n) => n.userId === user?.id && !n.read).length;
  const status = user?.employerApproval || "incomplete";
  const ready = user ? employerReadyForApproval(user) : false;

  return (
    <div>
      <SectionLabel>Key Metrics</SectionLabel>
      <MetricsCarousel>
        <MetricCard
          label="Jobs Posted"
          value={myJobs.length}
          tone="blue"
          href="/employer/jobs"
          icon={<IconBriefcase />}
        />
        <MetricCard
          label="Active Jobs"
          value={activeJobs}
          tone="green"
          href="/employer/jobs"
          icon={<IconCheck />}
        />
        <MetricCard
          label="Expired Jobs"
          value={expiredJobs}
          tone="red"
          href="/employer/jobs"
          icon={<IconClock />}
        />
        <MetricCard
          label="Total Applicants"
          value={applicants.length}
          tone="orange"
          href="/employer/applicants"
          icon={<IconApps />}
        />
      </MetricsCarousel>

      <div className="mt-6">
        <SectionLabel>Recruitment Pipeline</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Pending Applications"
            value={pendingApps}
            tone="pink"
            href="/employer/applicants"
            icon={<IconClock />}
          />
          <MetricCard
            label="Shortlisted"
            value={shortlisted}
            tone="purple"
            href="/employer/applicants"
            icon={<IconStar />}
          />
          <MetricCard
            label="Selected"
            value={selected}
            tone="teal"
            href="/employer/applicants"
            icon={<IconCheck />}
          />
          <MetricCard
            label="Unread Notifications"
            value={unread}
            tone="blue"
            href="/employer/notifications"
            icon={<IconBell />}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {(status === "incomplete" || status === "rejected") && (
          <Button disabled={!ready} onClick={() => alert(submitEmployerApproval().message)}>
            Submit for Approval
          </Button>
        )}
        <Link href="/employer/reports">
          <Button variant="secondary">Reports</Button>
        </Link>
        <Link href="/employer/profile">
          <Button variant="secondary">Profile</Button>
        </Link>
      </div>

      <div className="mt-6">
        <SectionLabel>Charts</SectionLabel>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Jobs Status"
            href="/employer/jobs"
            icon={<IconBriefcase />}
            legend={
              <LegendDots
                items={[
                  { label: "Active", color: "#16a34a" },
                  { label: "Expired", color: "#f59e0b" },
                  { label: "Other", color: "#2f4d9a" },
                ]}
              />
            }
          >
            <DonutChart
              slices={[
                {
                  label: "Active",
                  value: activeJobs,
                  color: "#16a34a",
                  tooltip: `${activeJobs} jobs available`,
                },
                {
                  label: "Expired",
                  value: expiredJobs,
                  color: "#f59e0b",
                  tooltip: `${expiredJobs} jobs expired`,
                },
                {
                  label: "Other",
                  value: Math.max(0, myJobs.length - activeJobs - expiredJobs),
                  color: "#2f4d9a",
                  tooltip: `${Math.max(0, myJobs.length - activeJobs - expiredJobs)} other jobs`,
                },
              ]}
            />
          </ChartCard>
          <ChartCard
            title="Applicants Pipeline"
            href="/employer/applicants"
            icon={<IconApps />}
            legend={
              <LegendDots
                items={[
                  { label: "Pending", color: "#f59e0b" },
                  { label: "Shortlisted", color: "#7c3aed" },
                  { label: "Selected", color: "#16a34a" },
                ]}
              />
            }
          >
            <DonutChart
              slices={[
                {
                  label: "Pending",
                  value: pendingApps,
                  color: "#f59e0b",
                  tooltip: `${pendingApps} applications pending review`,
                },
                {
                  label: "Shortlisted",
                  value: shortlisted,
                  color: "#7c3aed",
                  tooltip: `${shortlisted} candidates shortlisted`,
                },
                {
                  label: "Selected",
                  value: selected,
                  color: "#16a34a",
                  tooltip: `${selected} candidates selected`,
                },
              ]}
            />
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <Card title="Pipeline Snapshot">
          <ul className="space-y-2 text-sm text-[#5b6b85]">
            <li>
              <strong className="text-[#1b2a4a]">{activeJobs}</strong> active jobs accepting applications
            </li>
            <li>
              <strong className="text-[#1b2a4a]">{pendingApps}</strong> applications need review
            </li>
            <li>
              <strong className="text-[#1b2a4a]">{shortlisted}</strong> candidates shortlisted
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
