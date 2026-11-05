"use client";

import Link from "next/link";
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
  IconCalendar,
  IconCheck,
  IconProfile,
  IconStar,
} from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-store";
import { isJobActive } from "@/lib/jobs";
import { isSeekerProfileComplete, seekerCompletionPercent } from "@/lib/profile";

export default function SeekerDashboardPage() {
  const { user, jobs, applications, notifications, bookings, sessions } = useAuth();
  const complete = isSeekerProfileComplete(user?.seekerProfile);
  const percent = seekerCompletionPercent(user?.seekerProfile);
  const myApps = applications.filter((a) => a.seekerId === user?.id);
  const activeJobs = jobs.filter(isJobActive).length;
  const shortlisted = myApps.filter((a) => a.status === "Shortlisted").length;
  const underReview = myApps.filter((a) => a.status === "Under Review").length;
  const unread = notifications.filter((n) => n.userId === user?.id && !n.read).length;
  const myBookings = bookings.filter((b) => b.seekerId === user?.id);
  const upcomingSessions = sessions.filter(
    (s) => s.seekerId === user?.id && s.status === "Scheduled"
  ).length;

  return (
    <div>
      <SectionLabel>Key Metrics</SectionLabel>
      <MetricsCarousel>
        <MetricCard
          label="Profile Completion"
          value={`${percent}%`}
          tone="blue"
          href="/seeker/profile"
          icon={<IconProfile />}
        />
        <MetricCard
          label="Available Jobs"
          value={activeJobs}
          tone="green"
          href="/seeker/jobs"
          icon={<IconBriefcase />}
        />
        <MetricCard
          label="Applied Jobs"
          value={myApps.length}
          tone="orange"
          href="/seeker/applications"
          icon={<IconApps />}
        />
        <MetricCard
          label="Shortlisted"
          value={shortlisted}
          tone="purple"
          href="/seeker/applications"
          icon={<IconStar />}
        />
      </MetricsCarousel>

      <div className="mt-6">
        <SectionLabel>Status & Support</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Under Review"
            value={underReview}
            tone="pink"
            href="/seeker/applications"
            icon={<IconCheck />}
          />
          <MetricCard
            label="Counselling Bookings"
            value={myBookings.length}
            tone="teal"
            href="/seeker/counselling"
            icon={<IconCalendar />}
          />
          <MetricCard
            label="Upcoming Sessions"
            value={upcomingSessions}
            tone="blue"
            href="/seeker/counselling"
            icon={<IconCalendar />}
          />
          <MetricCard
            label="Unread Notifications"
            value={unread}
            tone="red"
            href="/seeker/notifications"
            icon={<IconBell />}
          />
        </div>
      </div>

      <div className="mt-6">
        <SectionLabel>Charts</SectionLabel>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="My Applications"
            href="/seeker/applications"
            icon={<IconApps />}
            legend={
              <LegendDots
                items={[
                  { label: "Under Review", color: "#db2777" },
                  { label: "Shortlisted", color: "#7c3aed" },
                  { label: "Other", color: "#2f4d9a" },
                ]}
              />
            }
          >
            <DonutChart
              slices={[
                {
                  label: "Under Review",
                  value: underReview,
                  color: "#db2777",
                  tooltip: `${underReview} applications under review`,
                },
                {
                  label: "Shortlisted",
                  value: shortlisted,
                  color: "#7c3aed",
                  tooltip: `${shortlisted} applications shortlisted`,
                },
                {
                  label: "Other",
                  value: Math.max(0, myApps.length - underReview - shortlisted),
                  color: "#2f4d9a",
                  tooltip: `${Math.max(0, myApps.length - underReview - shortlisted)} other applications`,
                },
              ]}
            />
          </ChartCard>
          <ChartCard
            title="Jobs & Counselling"
            icon={<IconBriefcase />}
            legend={
              <LegendDots
                items={[
                  { label: "Available Jobs", color: "#16a34a" },
                  { label: "Bookings", color: "#0d9488" },
                  { label: "Sessions", color: "#2f4d9a" },
                ]}
              />
            }
          >
            <DonutChart
              slices={[
                {
                  label: "Available Jobs",
                  value: activeJobs,
                  color: "#16a34a",
                  tooltip: `${activeJobs} jobs available`,
                },
                {
                  label: "Bookings",
                  value: myBookings.length,
                  color: "#0d9488",
                  tooltip: `${myBookings.length} counselling bookings`,
                },
                {
                  label: "Sessions",
                  value: upcomingSessions,
                  color: "#2f4d9a",
                  tooltip: `${upcomingSessions} upcoming sessions`,
                },
              ]}
            />
          </ChartCard>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card title="Next Steps">
          <ul className="space-y-2 text-sm text-[#5b6b85]">
            {!complete ? (
              <li>
                Complete your profile to unlock job applications (
                <Link href="/seeker/profile" className="font-medium text-primary">
                  open profile
                </Link>
                ).
              </li>
            ) : (
              <li>Your profile is ready — browse and apply to active jobs.</li>
            )}
            <li>
              Build or update a resume in{" "}
              <Link href="/seeker/resumes" className="font-medium text-primary">
                Resumes
              </Link>
              .
            </li>
            <li>
              Request counselling from{" "}
              <Link href="/seeker/counselling" className="font-medium text-primary">
                Counselling
              </Link>
              .
            </li>
          </ul>
        </Card>
        <Card title="Application Snapshot">
          <ul className="space-y-2 text-sm text-[#5b6b85]">
            <li>
              <strong className="text-[#1b2a4a]">{myApps.length}</strong> total applications
            </li>
            <li>
              <strong className="text-[#1b2a4a]">{underReview}</strong> under review
            </li>
            <li>
              <strong className="text-[#1b2a4a]">{shortlisted}</strong> shortlisted
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
