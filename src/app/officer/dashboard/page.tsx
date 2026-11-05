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
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconClock,
  IconUsers,
} from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-store";

export default function OfficerDashboardPage() {
  const { user, centers, bookings, sessions, users } = useAuth();
  const center = centers.find((c) => c.id === user?.placementCenterId);
  const centerBookings = bookings.filter((b) => b.centerId === user?.placementCenterId);
  const pending = centerBookings.filter((b) => b.status === "Pending").length;
  const approved = centerBookings.filter((b) => b.status === "Approved").length;
  const mySessions = sessions.filter((s) => s.officerId === user?.id);
  const upcoming = mySessions.filter((s) => s.status === "Scheduled").length;
  const completed = mySessions.filter((s) => s.status === "Completed").length;
  const assignedSeekers = new Set(centerBookings.map((b) => b.seekerId)).size;
  const pendingList = centerBookings.filter((b) => b.status === "Pending").slice(0, 5);

  return (
    <div>
      <SectionLabel>Key Metrics</SectionLabel>
      <MetricsCarousel>
        <MetricCard
          label="Pending Bookings"
          value={pending}
          tone="orange"
          href="/officer/bookings"
          icon={<IconClock />}
        />
        <MetricCard
          label="Upcoming Sessions"
          value={upcoming}
          tone="blue"
          href="/officer/sessions"
          icon={<IconCalendar />}
        />
        <MetricCard
          label="Completed Sessions"
          value={completed}
          tone="green"
          href="/officer/sessions"
          icon={<IconCheck />}
        />
        <MetricCard
          label="Assigned Seekers"
          value={assignedSeekers}
          tone="purple"
          icon={<IconUsers />}
        />
      </MetricsCarousel>

      <div className="mt-6">
        <SectionLabel>Center Activity</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Approved Bookings"
            value={approved}
            tone="teal"
            href="/officer/bookings"
            icon={<IconCheck />}
          />
          <MetricCard
            label="Total Bookings"
            value={centerBookings.length}
            tone="pink"
            href="/officer/bookings"
            icon={<IconApps />}
          />
          <MetricCard
            label="My Sessions"
            value={mySessions.length}
            tone="blue"
            href="/officer/sessions"
            icon={<IconCalendar />}
          />
          <MetricCard
            label="Placement Center"
            value={center ? 1 : 0}
            tone="orange"
            hint={center?.city || "Unassigned"}
            icon={<IconBuilding />}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/officer/reports">
          <Button variant="secondary">Reports</Button>
        </Link>
      </div>

      <div className="mt-6">
        <SectionLabel>Charts</SectionLabel>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Bookings Status"
            href="/officer/bookings"
            icon={<IconApps />}
            legend={
              <LegendDots
                items={[
                  { label: "Pending", color: "#f59e0b" },
                  { label: "Approved", color: "#16a34a" },
                  { label: "Other", color: "#2f4d9a" },
                ]}
              />
            }
          >
            <DonutChart
              slices={[
                {
                  label: "Pending",
                  value: pending,
                  color: "#f59e0b",
                  tooltip: `${pending} bookings pending review`,
                },
                {
                  label: "Approved",
                  value: approved,
                  color: "#16a34a",
                  tooltip: `${approved} bookings approved`,
                },
                {
                  label: "Other",
                  value: Math.max(0, centerBookings.length - pending - approved),
                  color: "#2f4d9a",
                  tooltip: `${Math.max(0, centerBookings.length - pending - approved)} other bookings`,
                },
              ]}
            />
          </ChartCard>
          <ChartCard
            title="Sessions Status"
            href="/officer/sessions"
            icon={<IconCalendar />}
            legend={
              <LegendDots
                items={[
                  { label: "Upcoming", color: "#2f4d9a" },
                  { label: "Completed", color: "#16a34a" },
                  { label: "Seekers", color: "#7c3aed" },
                ]}
              />
            }
          >
            <DonutChart
              slices={[
                {
                  label: "Upcoming",
                  value: upcoming,
                  color: "#2f4d9a",
                  tooltip: `${upcoming} upcoming sessions`,
                },
                {
                  label: "Completed",
                  value: completed,
                  color: "#16a34a",
                  tooltip: `${completed} sessions completed`,
                },
                {
                  label: "Seekers",
                  value: assignedSeekers,
                  color: "#7c3aed",
                  tooltip: `${assignedSeekers} assigned seekers`,
                },
              ]}
            />
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <Card title="Recent Pending Requests">
          {pendingList.length === 0 ? (
            <p className="text-sm text-muted">No pending requests.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {pendingList.map((b) => {
                const seeker = users.find((u) => u.id === b.seekerId);
                return (
                  <li key={b.id} className="border-b border-border pb-2 last:border-0">
                    <strong>{b.topic}</strong> —{" "}
                    {seeker?.seekerProfile?.fullName || seeker?.email} · {b.preferredDate}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
