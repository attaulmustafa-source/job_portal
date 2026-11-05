import type { UserRole } from "./types";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const roleLabels: Record<UserRole, string> = {
  seeker: "Job Seeker",
  employer: "Employer",
  admin: "Admin",
  officer: "Placement Officer",
};

export const navGroupsByRole: Record<UserRole, NavGroup[]> = {
  seeker: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/seeker/dashboard" },
      ],
    },
    {
      title: "Jobs & Career",
      items: [
        { label: "Jobs", href: "/seeker/jobs" },
        { label: "Applications", href: "/seeker/applications" },
        { label: "Resumes", href: "/seeker/resumes" },
        { label: "Counselling", href: "/seeker/counselling" },
      ],
    },
    {
      title: "Account",
      items: [{ label: "Settings", href: "/seeker/settings" }],
    },
  ],
  employer: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/employer/dashboard" },
      ],
    },
    {
      title: "Recruitment",
      items: [
        { label: "Jobs", href: "/employer/jobs" },
        { label: "Applicants", href: "/employer/applicants" },
      ],
    },
    {
      title: "Insights & Tools",
      items: [
        { label: "Reports", href: "/employer/reports" },
        { label: "Settings", href: "/employer/settings" },
      ],
    },
  ],
  admin: [
    {
      title: "Overview",
      items: [{ label: "Dashboard", href: "/admin/dashboard" }],
    },
    {
      title: "Portal Management",
      items: [
        { label: "Jobs", href: "/admin/jobs" },
        { label: "All Employers", href: "/admin/employers" },
        { label: "Job Seekers", href: "/admin/seekers" },
        { label: "Placement Centers", href: "/admin/centers" },
        { label: "Placement Officers", href: "/admin/officers" },
        { label: "Resume Templates", href: "/admin/templates" },
      ],
    },
    {
      title: "Insights & Tools",
      items: [
        { label: "Reports", href: "/admin/reports" },
        { label: "Settings", href: "/admin/settings" },
      ],
    },
  ],
  officer: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/officer/dashboard" },
        { label: "Bookings", href: "/officer/bookings" },
        { label: "Sessions", href: "/officer/sessions" },
      ],
    },
    {
      title: "Insights & Tools",
      items: [
        { label: "Reports", href: "/officer/reports" },
        { label: "Settings", href: "/officer/settings" },
      ],
    },
  ],
};

/** Flat list kept for any code that still needs it */
export const navByRole: Record<UserRole, NavItem[]> = {
  seeker: navGroupsByRole.seeker.flatMap((g) => g.items),
  employer: navGroupsByRole.employer.flatMap((g) => g.items),
  admin: navGroupsByRole.admin.flatMap((g) => g.items),
  officer: navGroupsByRole.officer.flatMap((g) => g.items),
};

export function dashboardPath(role: UserRole) {
  return `/${role}/dashboard`;
}

export function profilePath(role: UserRole) {
  if (role === "seeker") return "/seeker/profile";
  if (role === "employer") return "/employer/profile";
  if (role === "admin") return "/admin/profile";
  return `/${role}/settings`;
}

export function changePasswordPath(role: UserRole) {
  return `/${role}/change-password`;
}

export function displayName(user: {
  email: string;
  role: UserRole;
  fullName?: string;
  seekerProfile?: { fullName?: string };
  employerProfile?: { contactName?: string };
  organization?: { organizationName?: string };
}) {
  return (
    user.fullName ||
    user.seekerProfile?.fullName ||
    user.employerProfile?.contactName ||
    user.organization?.organizationName ||
    roleLabels[user.role]
  );
}
