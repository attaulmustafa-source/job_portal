"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getApplications,
  getBookings,
  getCenters,
  getJobs,
  getNotifications,
  getResumes,
  getResumeTemplates,
  getSessionUserId,
  getSessions,
  getUsers,
  NAVTCC_CNICS,
  saveApplications,
  saveBookings,
  saveCenters,
  saveJobs,
  saveNotifications,
  saveResumes,
  saveResumeTemplates,
  saveSessions,
  saveUsers,
  setSessionUserId,
} from "./storage";
import type {
  AppNotification,
  ApplicationStatus,
  CounsellingBooking,
  CounsellingSession,
  EmployerProfile,
  JobApplication,
  JobPosting,
  OrganizationDetails,
  PlacementCenter,
  ResumeContent,
  ResumeTemplate,
  ResumeTemplateStyle,
  SeekerProfile,
  SeekerResume,
  UserAccount,
  UserRole,
} from "./types";
import { canApplyToJob, employerReadyForApproval, isOrganizationComplete } from "./profile";
import { isJobActive, normalizeJobs } from "./jobs";
import { emptyOrganization } from "./organization";
import {
  contentFromProfile,
  emptySeekerProfile,
  normalizeResumeContent,
  normalizeSeekerProfile,
  profileFromResumeContent,
} from "./resume";

type JobInput = {
  title: string;
  company: string;
  companyLogo?: string;
  category?: import("./types").EmployerCategory;
  location: string;
  type: string;
  description: string;
  expiryDate: string;
  experienceRequired?: boolean;
  experienceDetails?: string;
};

interface AuthContextValue {
  user: UserAccount | null;
  users: UserAccount[];
  jobs: JobPosting[];
  applications: JobApplication[];
  notifications: AppNotification[];
  resumeTemplates: ResumeTemplate[];
  resumes: SeekerResume[];
  centers: PlacementCenter[];
  bookings: CounsellingBooking[];
  sessions: CounsellingSession[];
  ready: boolean;
  login: (
    identifier: string,
    password: string
  ) => { ok: boolean; message: string; role?: UserRole };
  logout: () => void;
  register: (input: {
    email: string;
    password: string;
    role: Extract<UserRole, "seeker" | "employer">;
    organizationName?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  }) => { ok: boolean; message: string; userId?: string };
  changePassword: (input: {
    currentPassword: string;
    newPassword: string;
  }) => { ok: boolean; message: string };
  verifyEmail: (userId: string) => void;
  updateSeekerProfile: (profile: SeekerProfile) => { ok: boolean; message: string };
  updateEmployerProfile: (profile: EmployerProfile) => void;
  updateOrganization: (
    org: OrganizationDetails
  ) => { ok: boolean; message: string; submitted?: boolean };
  submitEmployerApproval: () => { ok: boolean; message: string };
  setEmployerApproval: (userId: string, status: "approved" | "rejected") => void;
  deleteEmployer: (userId: string) => { ok: boolean; message: string };
  deleteSeeker: (userId: string) => { ok: boolean; message: string };
  deleteJob: (jobId: string) => { ok: boolean; message: string };
  applyToJob: (jobId: string) => { ok: boolean; message: string };
  createJob: (input: JobInput) => { ok: boolean; message: string };
  createJobForEmployer: (
    employerId: string,
    input: JobInput
  ) => { ok: boolean; message: string };
  updateJob: (
    jobId: string,
    input: Partial<JobInput> & { status?: JobPosting["status"] }
  ) => { ok: boolean; message: string };
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus
  ) => { ok: boolean; message: string };
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  createResumeTemplate: (input: {
    name: string;
    description: string;
    style: ResumeTemplateStyle;
    active?: boolean;
  }) => { ok: boolean; message: string };
  updateResumeTemplate: (
    id: string,
    input: Partial<{
      name: string;
      description: string;
      style: ResumeTemplateStyle;
      active: boolean;
    }>
  ) => { ok: boolean; message: string };
  deleteResumeTemplate: (id: string) => { ok: boolean; message: string };
  createResume: (input: {
    templateId: string;
    title: string;
    content?: Partial<ResumeContent>;
  }) => { ok: boolean; message: string; resumeId?: string };
  updateResume: (
    id: string,
    input: { title?: string; templateId?: string; content?: ResumeContent }
  ) => { ok: boolean; message: string };
  deleteResume: (id: string) => { ok: boolean; message: string };
  createCenter: (input: {
    name: string;
    city: string;
    address: string;
    phone: string;
    active?: boolean;
  }) => { ok: boolean; message: string };
  updateCenter: (
    id: string,
    input: Partial<{
      name: string;
      city: string;
      address: string;
      phone: string;
      active: boolean;
    }>
  ) => { ok: boolean; message: string };
  deleteCenter: (id: string) => { ok: boolean; message: string };
  createOfficer: (input: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    placementCenterId: string;
  }) => { ok: boolean; message: string };
  updateOfficerAssignment: (
    officerId: string,
    placementCenterId: string
  ) => { ok: boolean; message: string };
  deleteOfficer: (officerId: string) => { ok: boolean; message: string };
  createBooking: (input: {
    centerId: string;
    topic: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
  }) => { ok: boolean; message: string };
  reviewBooking: (
    bookingId: string,
    decision: "Approved" | "Rejected",
    rejectionReason?: string
  ) => { ok: boolean; message: string };
  scheduleSession: (input: {
    bookingId: string;
    scheduledDate: string;
    scheduledTime: string;
    mode: CounsellingSession["mode"];
  }) => { ok: boolean; message: string };
  completeSession: (
    sessionId: string,
    input: { feedback: string; outcome: string }
  ) => { ok: boolean; message: string };
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [resumeTemplates, setResumeTemplates] = useState<ResumeTemplate[]>([]);
  const [resumes, setResumes] = useState<SeekerResume[]>([]);
  const [centers, setCenters] = useState<PlacementCenter[]>([]);
  const [bookings, setBookings] = useState<CounsellingBooking[]>([]);
  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    const allUsers = getUsers();
    const sessionId = getSessionUserId();
    setUsers(allUsers);
    setUser(allUsers.find((u) => u.id === sessionId) ?? null);
    setJobs(getJobs());
    setApplications(getApplications());
    setNotifications(getNotifications());
    setResumeTemplates(getResumeTemplates());
    setResumes(
      getResumes().map((r) => ({
        ...r,
        content: normalizeResumeContent(r.content as never),
      }))
    );
    setCenters(getCenters());
    setBookings(getBookings());
    setSessions(getSessions());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const persistUsers = (next: UserAccount[], sessionId?: string | null) => {
    saveUsers(next);
    setUsers(next);
    const id = sessionId === undefined ? getSessionUserId() : sessionId;
    if (id) setSessionUserId(id);
    setUser(next.find((u) => u.id === id) ?? null);
  };

  const pushNotification = (
    userId: string,
    title: string,
    message: string,
    href?: string,
    current?: AppNotification[]
  ) => {
    const list = current ?? getNotifications();
    const item: AppNotification = {
      id: uid("notif"),
      userId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      href,
    };
    const next = [item, ...list];
    saveNotifications(next);
    setNotifications(next);
    return next;
  };

  const login: AuthContextValue["login"] = (identifier, password) => {
    const all = getUsers();
    const found = all.find(
      (u) =>
        (u.email.toLowerCase() === identifier.toLowerCase() ||
          u.username.toLowerCase() === identifier.toLowerCase()) &&
        u.password === password
    );
    if (!found) return { ok: false, message: "Invalid email/username or password." };
    if (!found.emailVerified) {
      return { ok: false, message: "Please verify your email before login." };
    }
    setSessionUserId(found.id);
    setUser(found);
    setUsers(all);
    setJobs(getJobs());
    setApplications(getApplications());
    setNotifications(getNotifications());
    setResumeTemplates(getResumeTemplates());
    setResumes(
      getResumes().map((r) => ({
        ...r,
        content: normalizeResumeContent(r.content as never),
      }))
    );
    setCenters(getCenters());
    setBookings(getBookings());
    setSessions(getSessions());
    return { ok: true, message: "Logged in.", role: found.role };
  };

  const logout = () => {
    setSessionUserId(null);
    setUser(null);
  };

  const changePassword: AuthContextValue["changePassword"] = ({
    currentPassword,
    newPassword,
  }) => {
    if (!user) return { ok: false, message: "You must be logged in." };
    if (user.password !== currentPassword) {
      return { ok: false, message: "Current password is incorrect." };
    }
    if (newPassword.length < 6) {
      return { ok: false, message: "New password must be at least 6 characters." };
    }
    if (currentPassword === newPassword) {
      return { ok: false, message: "New password must be different from the current password." };
    }
    const all = getUsers();
    const next = all.map((u) =>
      u.id === user.id ? { ...u, password: newPassword } : u
    );
    persistUsers(next, user.id);
    return { ok: true, message: "Password updated successfully." };
  };

  const register: AuthContextValue["register"] = ({
    email,
    password,
    role,
    organizationName,
    phone,
    firstName,
    lastName,
  }) => {
    const all = getUsers();
    if (all.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: "This email is already registered. Please login." };
    }
    const username = email.split("@")[0];
    const orgName = (organizationName || "").trim();
    const phoneNumber = (phone || "").trim();
    const first = (firstName || "").trim();
    const last = (lastName || "").trim();
    const fullName = [first, last].filter(Boolean).join(" ");

    if (role === "employer") {
      if (!orgName) {
        return { ok: false, message: "Organization name is required." };
      }
      if (!phoneNumber) {
        return { ok: false, message: "Mobile phone number is required." };
      }
    }

    if (role === "seeker") {
      if (!first) {
        return { ok: false, message: "First name is required." };
      }
      if (!last) {
        return { ok: false, message: "Last name is required." };
      }
      if (!phoneNumber) {
        return { ok: false, message: "Mobile phone number is required." };
      }
    }

    const account: UserAccount = {
      id: uid(role),
      email,
      username,
      password,
      role,
      emailVerified: false,
      employerApproval: role === "employer" ? "incomplete" : undefined,
      createdAt: new Date().toISOString(),
      ...(role === "employer"
        ? {
            phone: phoneNumber,
            employerProfile: {
              contactName: orgName,
              phone: phoneNumber,
              designation: "Focal Person",
            },
            organization: {
              ...emptyOrganization(),
              organizationName: orgName,
              focalPersonPhone: phoneNumber,
            },
          }
        : {
            fullName,
            phone: phoneNumber,
            seekerProfile: {
              ...emptySeekerProfile(),
              fullName,
              phone: phoneNumber,
            },
          }),
    };
    persistUsers([...all, account], null);
    return {
      ok: true,
      message: "Registration successful. Please verify your email.",
      userId: account.id,
    };
  };

  const verifyEmail = (userId: string) => {
    const all = getUsers();
    persistUsers(
      all.map((u) => (u.id === userId ? { ...u, emailVerified: true } : u)),
      null
    );
  };

  const updateSeekerProfile: AuthContextValue["updateSeekerProfile"] = (profile) => {
    if (!user || user.role !== "seeker") return { ok: false, message: "Not allowed." };

    const all = getUsers();
    const nextProfile = normalizeSeekerProfile({ ...profile });
    const cnic = nextProfile.cnic.trim();
    const phone = nextProfile.phone.trim();

    const duplicate = all.find(
      (u) =>
        u.id !== user.id &&
        u.role === "seeker" &&
        ((u.seekerProfile?.cnic && u.seekerProfile.cnic === cnic) ||
          (u.seekerProfile?.phone && u.seekerProfile.phone === phone))
    );
    if (duplicate) {
      return {
        ok: false,
        message: "This CNIC or phone is already registered. Please login.",
      };
    }

    if (NAVTCC_CNICS.has(cnic) && user.email !== "graduate@navtcc.local") {
      const existing = all.find((u) => u.seekerProfile?.cnic === cnic);
      if (existing && existing.id !== user.id) {
        return {
          ok: false,
          message:
            "Your credentials are already available. Please login with your NAVTCC credentials.",
        };
      }
      if (!existing) {
        return {
          ok: false,
          message:
            "Your credentials are already available. Please login with your NAVTCC credentials (graduate@navtcc.local / navtcc123).",
        };
      }
    }

    if (!cnic) {
      return { ok: false, message: "CNIC verification failed. Please check your CNIC and try again." };
    }

    const savedProfile = { ...nextProfile, cnic, phone };
    persistUsers(
      all.map((u) => (u.id === user.id ? { ...u, seekerProfile: savedProfile } : u)),
      user.id
    );

    // Push profile into all of this seeker's resumes
    const now = new Date().toISOString();
    const nextResumes = getResumes().map((r) => {
      if (r.seekerId !== user.id) return r;
      return {
        ...r,
        content: contentFromProfile(user.email, savedProfile),
        updatedAt: now,
      };
    });
    saveResumes(nextResumes);
    setResumes(nextResumes);

    return { ok: true, message: "Profile saved and synced to your resumes." };
  };

  const updateEmployerProfile = (profile: EmployerProfile) => {
    if (!user || user.role !== "employer") return;
    const all = getUsers();
    persistUsers(
      all.map((u) => {
        if (u.id !== user.id) return u;
        const updated = { ...u, employerProfile: profile };
        if (u.employerApproval === "approved" || u.employerApproval === "pending") return updated;
        return { ...updated, employerApproval: "incomplete" as const };
      }),
      user.id
    );
  };

  const updateOrganization: AuthContextValue["updateOrganization"] = (org) => {
    if (!user || user.role !== "employer") {
      return { ok: false, message: "Not allowed." };
    }
    const complete = isOrganizationComplete(org);
    const all = getUsers();
    let autoSubmitted = false;
    const nextUsers = all.map((u) => {
      if (u.id !== user.id) return u;
      const syncedProfile = {
        contactName: org.focalPersonName || u.employerProfile?.contactName || "",
        phone: org.focalPersonPhone || u.employerProfile?.phone || "",
        designation:
          org.focalPersonDesignation || u.employerProfile?.designation || "Focal Person",
      };
      let employerApproval = u.employerApproval;
      if (u.employerApproval === "approved") {
        employerApproval = "approved";
      } else if (u.employerApproval === "pending") {
        employerApproval = "pending";
      } else if (complete) {
        employerApproval = "pending";
        autoSubmitted = true;
      } else {
        employerApproval = "incomplete";
      }
      return {
        ...u,
        organization: org,
        employerProfile: syncedProfile,
        employerApproval,
      };
    });
    persistUsers(nextUsers, user.id);

    // Keep job logos/company name in sync with organization
    const nextJobs = getJobs().map((j) =>
      j.employerId === user.id
        ? {
            ...j,
            company: org.organizationName || j.company,
            companyLogo: org.logoUrl || "",
            updatedAt: new Date().toISOString(),
          }
        : j
    );
    saveJobs(nextJobs);
    setJobs(nextJobs);

    if (autoSubmitted) {
      const admins = nextUsers.filter((u) => u.role === "admin");
      let notifs = getNotifications();
      for (const admin of admins) {
        notifs = pushNotification(
          admin.id,
          "Employer approval requested",
          `${user.email} completed profile and submitted for approval.`,
          "/admin/employers",
          notifs
        );
      }
      return {
        ok: true,
        message: "Profile completed and submitted for admin approval.",
        submitted: true,
      };
    }

    if (!complete) {
      return {
        ok: true,
        message: "Profile saved. Fill every required field to submit for approval.",
        submitted: false,
      };
    }

    return { ok: true, message: "Organization saved.", submitted: false };
  };

  const submitEmployerApproval: AuthContextValue["submitEmployerApproval"] = () => {
    if (!user || user.role !== "employer") return { ok: false, message: "Not allowed." };
    if (!employerReadyForApproval(user)) {
      return {
        ok: false,
        message: "Complete profile and organization details before submitting for approval.",
      };
    }
    const all = getUsers();
    persistUsers(
      all.map((u) => (u.id === user.id ? { ...u, employerApproval: "pending" as const } : u)),
      user.id
    );
    const admins = all.filter((u) => u.role === "admin");
    let notifs = getNotifications();
    for (const admin of admins) {
      notifs = pushNotification(
        admin.id,
        "Employer approval requested",
        `${user.email} submitted organization for approval.`,
        "/admin/employers",
        notifs
      );
    }
    return { ok: true, message: "Submitted for admin approval." };
  };

  const setEmployerApproval: AuthContextValue["setEmployerApproval"] = (userId, status) => {
    const all = getUsers();
    persistUsers(
      all.map((u) => (u.id === userId ? { ...u, employerApproval: status } : u)),
      getSessionUserId()
    );
    pushNotification(
      userId,
      status === "approved" ? "Employer approved" : "Employer rejected",
      status === "approved"
        ? "Your employer account is approved. You can post jobs now."
        : "Your employer registration was rejected. Update details and resubmit.",
      "/employer/dashboard"
    );
  };

  const deleteEmployer: AuthContextValue["deleteEmployer"] = (userId) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const all = getUsers();
    const target = all.find((u) => u.id === userId && u.role === "employer");
    if (!target) return { ok: false, message: "Employer not found." };

    persistUsers(
      all.filter((u) => u.id !== userId),
      getSessionUserId()
    );

    const remainingJobs = getJobs().filter((j) => j.employerId !== userId);
    const removedJobIds = new Set(
      getJobs().filter((j) => j.employerId === userId).map((j) => j.id)
    );
    saveJobs(remainingJobs);
    setJobs(remainingJobs);

    const remainingApps = getApplications().filter((a) => !removedJobIds.has(a.jobId));
    saveApplications(remainingApps);
    setApplications(remainingApps);

    const remainingNotifs = getNotifications().filter((n) => n.userId !== userId);
    saveNotifications(remainingNotifs);
    setNotifications(remainingNotifs);

    return { ok: true, message: "Employer deleted." };
  };

  const deleteSeeker: AuthContextValue["deleteSeeker"] = (userId) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const all = getUsers();
    const target = all.find((u) => u.id === userId && u.role === "seeker");
    if (!target) return { ok: false, message: "Job seeker not found." };

    persistUsers(
      all.filter((u) => u.id !== userId),
      getSessionUserId()
    );

    const remainingApps = getApplications().filter((a) => a.seekerId !== userId);
    saveApplications(remainingApps);
    setApplications(remainingApps);

    const remainingNotifs = getNotifications().filter((n) => n.userId !== userId);
    saveNotifications(remainingNotifs);
    setNotifications(remainingNotifs);

    const remainingResumes = getResumes().filter((r) => r.seekerId !== userId);
    saveResumes(remainingResumes);
    setResumes(remainingResumes);

    return { ok: true, message: "Job seeker deleted." };
  };

  const deleteJob: AuthContextValue["deleteJob"] = (jobId) => {
    if (!user || (user.role !== "admin" && user.role !== "employer")) {
      return { ok: false, message: "Not allowed." };
    }
    const allJobs = getJobs();
    const job = allJobs.find((j) => j.id === jobId);
    if (!job) return { ok: false, message: "Job not found." };
    if (user.role === "employer" && job.employerId !== user.id) {
      return { ok: false, message: "Not allowed." };
    }

    const remainingJobs = allJobs.filter((j) => j.id !== jobId);
    saveJobs(remainingJobs);
    setJobs(remainingJobs);

    const remainingApps = getApplications().filter((a) => a.jobId !== jobId);
    saveApplications(remainingApps);
    setApplications(remainingApps);

    return { ok: true, message: "Job deleted." };
  };

  const applyToJob: AuthContextValue["applyToJob"] = (jobId) => {
    if (!user || user.role !== "seeker") return { ok: false, message: "Not allowed." };
    const allJobs = normalizeJobs(getJobs());
    const job = allJobs.find((j) => j.id === jobId);
    if (!job) return { ok: false, message: "Job not found." };
    const eligibility = canApplyToJob(user.seekerProfile, job);
    if (!eligibility.ok) {
      return { ok: false, message: eligibility.message };
    }
    if (!isJobActive(job)) {
      return { ok: false, message: "This job has expired or is not accepting applications." };
    }

    const apps = getApplications();
    if (apps.some((a) => a.jobId === jobId && a.seekerId === user.id)) {
      return { ok: false, message: "You already applied for this job." };
    }

    const now = new Date().toISOString();
    const app: JobApplication = {
      id: uid("app"),
      jobId,
      seekerId: user.id,
      status: "Applied",
      appliedAt: now,
      updatedAt: now,
      history: [{ status: "Applied", at: now }],
    };
    const next = [app, ...apps];
    saveApplications(next);
    setApplications(next);
    setJobs(allJobs);
    saveJobs(allJobs);

    pushNotification(
      user.id,
      "Application submitted",
      `You applied for ${job.title}.`,
      "/seeker/applications"
    );
    pushNotification(
      job.employerId,
      "New applicant",
      `${user.seekerProfile?.fullName || user.email} applied for ${job.title}.`,
      "/employer/applicants"
    );
    return { ok: true, message: "Application submitted." };
  };

  const createJob: AuthContextValue["createJob"] = (input) => {
    if (!user || user.role !== "employer" || user.employerApproval !== "approved") {
      return { ok: false, message: "Job posting is available after admin approval." };
    }
    if (!input.expiryDate) {
      return { ok: false, message: "Expiry date is required." };
    }
    const now = new Date().toISOString();
    const orgCategory = user.organization?.category;
    const category =
      input.category ||
      (orgCategory === "Government" || orgCategory === "Private" || orgCategory === "Foreign"
        ? orgCategory
        : "Private");
    const job: JobPosting = {
      ...input,
      category,
      companyLogo: input.companyLogo || user.organization?.logoUrl || "",
      id: uid("job"),
      employerId: user.id,
      status: "published",
      createdAt: now,
      updatedAt: now,
    };
    const next = normalizeJobs([job, ...getJobs()]);
    saveJobs(next);
    setJobs(next);
    pushNotification(
      user.id,
      "Job published",
      `${job.title} is live until ${job.expiryDate}.`,
      "/employer/jobs"
    );
    return { ok: true, message: "Job published." };
  };

  const createJobForEmployer: AuthContextValue["createJobForEmployer"] = (
    employerId,
    input
  ) => {
    if (!user || user.role !== "admin") {
      return { ok: false, message: "Only admins can post jobs on behalf of employers." };
    }
    const employer = getUsers().find((u) => u.id === employerId && u.role === "employer");
    if (!employer) {
      return { ok: false, message: "Employer not found." };
    }
    if (employer.employerApproval !== "approved") {
      return { ok: false, message: "Employer must be active (approved) before posting jobs." };
    }
    if (!input.expiryDate) {
      return { ok: false, message: "Expiry date is required." };
    }
    const orgCategory = employer.organization?.category;
    const category =
      input.category ||
      (orgCategory === "Government" || orgCategory === "Private" || orgCategory === "Foreign"
        ? orgCategory
        : "Private");
    const now = new Date().toISOString();
    const job: JobPosting = {
      ...input,
      category,
      company: input.company || employer.organization?.organizationName || "Organization",
      companyLogo: input.companyLogo || employer.organization?.logoUrl || "",
      id: uid("job"),
      employerId: employer.id,
      status: "published",
      createdAt: now,
      updatedAt: now,
    };
    const next = normalizeJobs([job, ...getJobs()]);
    saveJobs(next);
    setJobs(next);
    pushNotification(
      employer.id,
      "Job published by admin",
      `${job.title} was posted on your behalf and is live until ${job.expiryDate}.`,
      "/employer/jobs"
    );
    return { ok: true, message: "Job published for employer." };
  };

  const updateJob: AuthContextValue["updateJob"] = (jobId, input) => {
    if (!user || user.role !== "employer") return { ok: false, message: "Not allowed." };
    const allJobs = getJobs();
    const existing = allJobs.find((j) => j.id === jobId);
    if (!existing || existing.employerId !== user.id) {
      return { ok: false, message: "Job not found." };
    }
    const now = new Date().toISOString();
    const next = normalizeJobs(
      allJobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              ...input,
              updatedAt: now,
            }
          : j
      )
    );
    saveJobs(next);
    setJobs(next);
    return { ok: true, message: "Job updated." };
  };

  const updateApplicationStatus: AuthContextValue["updateApplicationStatus"] = (
    applicationId,
    status
  ) => {
    if (!user || (user.role !== "employer" && user.role !== "admin")) {
      return { ok: false, message: "Not allowed." };
    }
    const apps = getApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) return { ok: false, message: "Application not found." };

    const job = getJobs().find((j) => j.id === app.jobId);
    if (user.role === "employer" && job?.employerId !== user.id) {
      return { ok: false, message: "Not allowed." };
    }

    const now = new Date().toISOString();
    const next = apps.map((a) =>
      a.id === applicationId
        ? {
            ...a,
            status,
            updatedAt: now,
            history: [...(a.history || []), { status, at: now }],
          }
        : a
    );
    saveApplications(next);
    setApplications(next);

    pushNotification(
      app.seekerId,
      "Application status updated",
      `${job?.title || "Job"} is now: ${status}.`,
      "/seeker/applications"
    );
    return { ok: true, message: "Status updated." };
  };

  const markNotificationRead = (id: string) => {
    const next = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(next);
    setNotifications(next);
  };

  const markAllNotificationsRead = () => {
    if (!user) return;
    const next = getNotifications().map((n) =>
      n.userId === user.id ? { ...n, read: true } : n
    );
    saveNotifications(next);
    setNotifications(next);
  };

  const createResumeTemplate: AuthContextValue["createResumeTemplate"] = (input) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const now = new Date().toISOString();
    const item: ResumeTemplate = {
      id: uid("tpl"),
      name: input.name.trim(),
      description: input.description.trim(),
      style: input.style,
      active: input.active !== false,
      createdAt: now,
      updatedAt: now,
    };
    const next = [item, ...getResumeTemplates()];
    saveResumeTemplates(next);
    setResumeTemplates(next);
    return { ok: true, message: "Template created." };
  };

  const updateResumeTemplate: AuthContextValue["updateResumeTemplate"] = (id, input) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const next = getResumeTemplates().map((t) =>
      t.id === id ? { ...t, ...input, updatedAt: new Date().toISOString() } : t
    );
    saveResumeTemplates(next);
    setResumeTemplates(next);
    return { ok: true, message: "Template updated." };
  };

  const deleteResumeTemplate: AuthContextValue["deleteResumeTemplate"] = (id) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const inUse = getResumes().some((r) => r.templateId === id);
    if (inUse) {
      return {
        ok: false,
        message: "Template is used by saved resumes. Deactivate it instead of deleting.",
      };
    }
    const next = getResumeTemplates().filter((t) => t.id !== id);
    saveResumeTemplates(next);
    setResumeTemplates(next);
    return { ok: true, message: "Template deleted." };
  };

  const createResume: AuthContextValue["createResume"] = (input) => {
    if (!user || user.role !== "seeker") return { ok: false, message: "Not allowed." };
    const template = getResumeTemplates().find((t) => t.id === input.templateId && t.active);
    if (!template) return { ok: false, message: "Template not available." };

    const now = new Date().toISOString();
    const content: ResumeContent = normalizeResumeContent({
      ...contentFromProfile(user.email, user.seekerProfile),
      ...(input.content || {}),
    });
    const resume: SeekerResume = {
      id: uid("resume"),
      seekerId: user.id,
      templateId: template.id,
      title: input.title.trim() || "My Resume",
      content,
      createdAt: now,
      updatedAt: now,
    };
    const next = [resume, ...getResumes()];
    saveResumes(next);
    setResumes(next);
    return { ok: true, message: "Resume created.", resumeId: resume.id };
  };

  const updateResume: AuthContextValue["updateResume"] = (id, input) => {
    if (!user || user.role !== "seeker") return { ok: false, message: "Not allowed." };
    const existing = getResumes().find((r) => r.id === id && r.seekerId === user.id);
    if (!existing) return { ok: false, message: "Resume not found." };
    const nextContent = input.content
      ? normalizeResumeContent(input.content)
      : existing.content;
    const next = getResumes().map((r) =>
      r.id === id
        ? {
            ...r,
            title: input.title ?? r.title,
            templateId: input.templateId ?? r.templateId,
            content: nextContent,
            updatedAt: new Date().toISOString(),
          }
        : r
    );
    saveResumes(next);
    setResumes(next);

    // Sync resume content back into seeker profile
    if (input.content) {
      const syncedProfile = profileFromResumeContent(nextContent, user.seekerProfile);
      const all = getUsers();
      persistUsers(
        all.map((u) => (u.id === user.id ? { ...u, seekerProfile: syncedProfile } : u)),
        user.id
      );
      return { ok: true, message: "Resume saved and synced to your profile." };
    }

    return { ok: true, message: "Resume saved." };
  };

  const deleteResume: AuthContextValue["deleteResume"] = (id) => {
    if (!user || (user.role !== "seeker" && user.role !== "admin")) {
      return { ok: false, message: "Not allowed." };
    }
    const existing = getResumes().find((r) => r.id === id);
    if (!existing) return { ok: false, message: "Resume not found." };
    if (user.role === "seeker" && existing.seekerId !== user.id) {
      return { ok: false, message: "Not allowed." };
    }
    const next = getResumes().filter((r) => r.id !== id);
    saveResumes(next);
    setResumes(next);
    return { ok: true, message: "Resume deleted." };
  };

  const createCenter: AuthContextValue["createCenter"] = (input) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const now = new Date().toISOString();
    const center: PlacementCenter = {
      id: uid("center"),
      name: input.name.trim(),
      city: input.city.trim(),
      address: input.address.trim(),
      phone: input.phone.trim(),
      active: input.active !== false,
      createdAt: now,
      updatedAt: now,
    };
    const next = [center, ...getCenters()];
    saveCenters(next);
    setCenters(next);
    return { ok: true, message: "Placement center created." };
  };

  const updateCenter: AuthContextValue["updateCenter"] = (id, input) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const next = getCenters().map((c) =>
      c.id === id ? { ...c, ...input, updatedAt: new Date().toISOString() } : c
    );
    saveCenters(next);
    setCenters(next);
    return { ok: true, message: "Center updated." };
  };

  const deleteCenter: AuthContextValue["deleteCenter"] = (id) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const officers = getUsers().filter((u) => u.role === "officer" && u.placementCenterId === id);
    if (officers.length) {
      return { ok: false, message: "Reassign officers before deleting this center." };
    }
    const next = getCenters().filter((c) => c.id !== id);
    saveCenters(next);
    setCenters(next);
    return { ok: true, message: "Center deleted." };
  };

  const createOfficer: AuthContextValue["createOfficer"] = (input) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const all = getUsers();
    if (all.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      return { ok: false, message: "Email already registered." };
    }
    if (!getCenters().some((c) => c.id === input.placementCenterId)) {
      return { ok: false, message: "Invalid placement center." };
    }
    const account: UserAccount = {
      id: uid("officer"),
      email: input.email.trim(),
      username: input.email.split("@")[0],
      password: input.password,
      role: "officer",
      emailVerified: true,
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      placementCenterId: input.placementCenterId,
      createdAt: new Date().toISOString(),
    };
    persistUsers([...all, account], getSessionUserId());
    return { ok: true, message: "Placement officer created." };
  };

  const updateOfficerAssignment: AuthContextValue["updateOfficerAssignment"] = (
    officerId,
    placementCenterId
  ) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    if (!getCenters().some((c) => c.id === placementCenterId)) {
      return { ok: false, message: "Invalid placement center." };
    }
    const all = getUsers();
    const officer = all.find((u) => u.id === officerId && u.role === "officer");
    if (!officer) return { ok: false, message: "Officer not found." };
    persistUsers(
      all.map((u) => (u.id === officerId ? { ...u, placementCenterId } : u)),
      getSessionUserId()
    );
    return { ok: true, message: "Officer assigned." };
  };

  const deleteOfficer: AuthContextValue["deleteOfficer"] = (officerId) => {
    if (!user || user.role !== "admin") return { ok: false, message: "Not allowed." };
    const all = getUsers();
    const officer = all.find((u) => u.id === officerId && u.role === "officer");
    if (!officer) return { ok: false, message: "Officer not found." };
    persistUsers(
      all.filter((u) => u.id !== officerId),
      getSessionUserId()
    );
    return { ok: true, message: "Officer deleted." };
  };

  const createBooking: AuthContextValue["createBooking"] = (input) => {
    if (!user || user.role !== "seeker") return { ok: false, message: "Not allowed." };
    const center = getCenters().find((c) => c.id === input.centerId && c.active);
    if (!center) return { ok: false, message: "Select an active placement center." };
    const now = new Date().toISOString();
    const booking: CounsellingBooking = {
      id: uid("book"),
      seekerId: user.id,
      centerId: center.id,
      topic: input.topic.trim(),
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      notes: input.notes.trim(),
      status: "Pending",
      createdAt: now,
      updatedAt: now,
    };
    const next = [booking, ...getBookings()];
    saveBookings(next);
    setBookings(next);

    const officers = getUsers().filter(
      (u) => u.role === "officer" && u.placementCenterId === center.id
    );
    let notifs = getNotifications();
    for (const officer of officers) {
      notifs = pushNotification(
        officer.id,
        "New counselling booking",
        `${user.seekerProfile?.fullName || user.email} requested: ${booking.topic}`,
        "/officer/bookings",
        notifs
      );
    }
    return { ok: true, message: "Counselling request submitted." };
  };

  const reviewBooking: AuthContextValue["reviewBooking"] = (
    bookingId,
    decision,
    rejectionReason
  ) => {
    if (!user || user.role !== "officer") return { ok: false, message: "Not allowed." };
    const booking = getBookings().find((b) => b.id === bookingId);
    if (!booking) return { ok: false, message: "Booking not found." };
    if (booking.centerId !== user.placementCenterId) {
      return { ok: false, message: "This booking is not for your center." };
    }
    if (booking.status !== "Pending") {
      return { ok: false, message: "Only pending bookings can be reviewed." };
    }
    const now = new Date().toISOString();
    const next = getBookings().map((b) =>
      b.id === bookingId
        ? {
            ...b,
            status: decision,
            officerId: user.id,
            rejectionReason: decision === "Rejected" ? rejectionReason || "" : undefined,
            updatedAt: now,
          }
        : b
    );
    saveBookings(next);
    setBookings(next);
    pushNotification(
      booking.seekerId,
      decision === "Approved" ? "Booking approved" : "Booking rejected",
      decision === "Approved"
        ? "Your counselling request was approved. Session will be scheduled soon."
        : `Your counselling request was rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ""}`,
      "/seeker/counselling"
    );
    return { ok: true, message: `Booking ${decision.toLowerCase()}.` };
  };

  const scheduleSession: AuthContextValue["scheduleSession"] = (input) => {
    if (!user || user.role !== "officer") return { ok: false, message: "Not allowed." };
    const booking = getBookings().find((b) => b.id === input.bookingId);
    if (!booking) return { ok: false, message: "Booking not found." };
    if (booking.centerId !== user.placementCenterId) {
      return { ok: false, message: "This booking is not for your center." };
    }
    if (booking.status !== "Approved" && booking.status !== "Pending") {
      return { ok: false, message: "Booking cannot be scheduled in current status." };
    }
    const now = new Date().toISOString();
    const session: CounsellingSession = {
      id: uid("session"),
      bookingId: booking.id,
      seekerId: booking.seekerId,
      officerId: user.id,
      centerId: booking.centerId,
      scheduledDate: input.scheduledDate,
      scheduledTime: input.scheduledTime,
      mode: input.mode,
      status: "Scheduled",
      feedback: "",
      outcome: "",
      createdAt: now,
      updatedAt: now,
    };
    const nextSessions = [session, ...getSessions()];
    saveSessions(nextSessions);
    setSessions(nextSessions);

    const nextBookings = getBookings().map((b) =>
      b.id === booking.id
        ? { ...b, status: "Scheduled" as const, officerId: user.id, updatedAt: now }
        : b
    );
    saveBookings(nextBookings);
    setBookings(nextBookings);

    pushNotification(
      booking.seekerId,
      "Counselling session scheduled",
      `Session on ${input.scheduledDate} at ${input.scheduledTime} (${input.mode}).`,
      "/seeker/counselling"
    );
    return { ok: true, message: "Session scheduled." };
  };

  const completeSession: AuthContextValue["completeSession"] = (sessionId, input) => {
    if (!user || user.role !== "officer") return { ok: false, message: "Not allowed." };
    const session = getSessions().find((s) => s.id === sessionId);
    if (!session) return { ok: false, message: "Session not found." };
    if (session.officerId !== user.id) return { ok: false, message: "Not allowed." };
    const now = new Date().toISOString();
    const nextSessions = getSessions().map((s) =>
      s.id === sessionId
        ? {
            ...s,
            status: "Completed" as const,
            feedback: input.feedback.trim(),
            outcome: input.outcome.trim(),
            updatedAt: now,
          }
        : s
    );
    saveSessions(nextSessions);
    setSessions(nextSessions);

    const nextBookings = getBookings().map((b) =>
      b.id === session.bookingId ? { ...b, status: "Completed" as const, updatedAt: now } : b
    );
    saveBookings(nextBookings);
    setBookings(nextBookings);

    pushNotification(
      session.seekerId,
      "Counselling session completed",
      "Your counselling session is marked completed. Feedback has been recorded.",
      "/seeker/counselling"
    );
    return { ok: true, message: "Session completed." };
  };

  const value = useMemo(
    () => ({
      user,
      users,
      jobs,
      applications,
      notifications,
      resumeTemplates,
      resumes,
      centers,
      bookings,
      sessions,
      ready,
      login,
      logout,
      register,
      changePassword,
      verifyEmail,
      updateSeekerProfile,
      updateEmployerProfile,
      updateOrganization,
      submitEmployerApproval,
      setEmployerApproval,
      deleteEmployer,
      deleteSeeker,
      deleteJob,
      applyToJob,
      createJob,
      createJobForEmployer,
      updateJob,
      updateApplicationStatus,
      markNotificationRead,
      markAllNotificationsRead,
      createResumeTemplate,
      updateResumeTemplate,
      deleteResumeTemplate,
      createResume,
      updateResume,
      deleteResume,
      createCenter,
      updateCenter,
      deleteCenter,
      createOfficer,
      updateOfficerAssignment,
      deleteOfficer,
      createBooking,
      reviewBooking,
      scheduleSession,
      completeSession,
      refresh,
    }),
    [
      user,
      users,
      jobs,
      applications,
      notifications,
      resumeTemplates,
      resumes,
      centers,
      bookings,
      sessions,
      ready,
      refresh,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
