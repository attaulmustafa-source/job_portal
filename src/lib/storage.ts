import type {
  AppNotification,
  CounsellingBooking,
  CounsellingSession,
  JobApplication,
  JobPosting,
  PlacementCenter,
  ResumeTemplate,
  SeekerResume,
  UserAccount,
} from "./types";
import { normalizeJobs, withJobCategoryFromEmployer } from "./jobs";
import { normalizeOrganization } from "./organization";
import { normalizeSeekerProfile } from "./resume";

const USERS_KEY = "jp_users_v6";
const USERS_KEY_LEGACY = "jp_users_v5";
const SESSION_KEY = "jp_session";
const JOBS_KEY = "jp_jobs_v4";
const APPS_KEY = "jp_applications_v3";
const NOTIF_KEY = "jp_notifications_v3";
const TEMPLATES_KEY = "jp_resume_templates_v1";
const RESUMES_KEY = "jp_resumes_v1";
const CENTERS_KEY = "jp_centers_v1";
const BOOKINGS_KEY = "jp_bookings_v1";
const SESSIONS_KEY = "jp_sessions_v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeUserAccount(user: UserAccount): UserAccount {
  if (user.role === "seeker") {
    return {
      ...user,
      seekerProfile: normalizeSeekerProfile(user.seekerProfile),
    };
  }
  if (user.role === "employer") {
    return {
      ...user,
      organization: normalizeOrganization(user.organization),
    };
  }
  return user;
}

export function getUsers(): UserAccount[] {
  const fromV6 = read<UserAccount[] | null>(USERS_KEY, null);
  if (fromV6) return fromV6.map(normalizeUserAccount);
  const fromV5 = read<UserAccount[] | null>(USERS_KEY_LEGACY, null);
  if (fromV5) {
    const normalized = fromV5.map(normalizeUserAccount);
    write(USERS_KEY, normalized);
    return normalized;
  }
  return seedUsers();
}

export function saveUsers(users: UserAccount[]) {
  write(USERS_KEY, users);
}

export function getSessionUserId(): string | null {
  return read<string | null>(SESSION_KEY, null);
}

export function setSessionUserId(id: string | null) {
  if (id) write(SESSION_KEY, id);
  else localStorage.removeItem(SESSION_KEY);
}

export function getJobs(): JobPosting[] {
  const existing = read<JobPosting[] | null>(JOBS_KEY, null);
  if (existing) {
    const users = getUsers();
    const withCategories = existing.map((job) => {
      const employer = users.find((u) => u.id === job.employerId);
      return withJobCategoryFromEmployer(job, employer?.organization?.category);
    });
    const normalized = normalizeJobs(withCategories);
    write(JOBS_KEY, normalized);
    return normalized;
  }
  return seedJobs();
}

export function saveJobs(jobs: JobPosting[]) {
  write(JOBS_KEY, normalizeJobs(jobs));
}

export function getApplications(): JobApplication[] {
  return read<JobApplication[]>(APPS_KEY, []);
}

export function saveApplications(apps: JobApplication[]) {
  write(APPS_KEY, apps);
}

export function getNotifications(): AppNotification[] {
  return read<AppNotification[]>(NOTIF_KEY, []);
}

export function saveNotifications(items: AppNotification[]) {
  write(NOTIF_KEY, items);
}

export function getResumeTemplates(): ResumeTemplate[] {
  const existing = read<ResumeTemplate[] | null>(TEMPLATES_KEY, null);
  if (existing) return existing;
  return seedTemplates();
}

export function saveResumeTemplates(items: ResumeTemplate[]) {
  write(TEMPLATES_KEY, items);
}

export function getResumes(): SeekerResume[] {
  return read<SeekerResume[]>(RESUMES_KEY, []);
}

export function saveResumes(items: SeekerResume[]) {
  write(RESUMES_KEY, items);
}

export function getCenters(): PlacementCenter[] {
  const existing = read<PlacementCenter[] | null>(CENTERS_KEY, null);
  if (existing) return existing;
  return seedCenters();
}

export function saveCenters(items: PlacementCenter[]) {
  write(CENTERS_KEY, items);
}

export function getBookings(): CounsellingBooking[] {
  return read<CounsellingBooking[]>(BOOKINGS_KEY, []);
}

export function saveBookings(items: CounsellingBooking[]) {
  write(BOOKINGS_KEY, items);
}

export function getSessions(): CounsellingSession[] {
  return read<CounsellingSession[]>(SESSIONS_KEY, []);
}

export function saveSessions(items: CounsellingSession[]) {
  write(SESSIONS_KEY, items);
}

function seedCenters(): PlacementCenter[] {
  const now = new Date().toISOString();
  const items: PlacementCenter[] = [
    {
      id: "center-lahore",
      name: "NAVTCC Placement Center Lahore",
      city: "Lahore",
      address: "Main Campus, Lahore",
      phone: "042-111000111",
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "center-islamabad",
      name: "NAVTCC Placement Center Islamabad",
      city: "Islamabad",
      address: "H-8/1, Islamabad",
      phone: "051-111000111",
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
  write(CENTERS_KEY, items);
  return items;
}

function seedTemplates(): ResumeTemplate[] {
  const now = new Date().toISOString();
  const items: ResumeTemplate[] = [
    {
      id: "tpl-classic",
      name: "Classic",
      description: "Clean single-column resume with strong headings.",
      style: "classic",
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "tpl-modern",
      name: "Modern",
      description: "Blue accent header with modern section layout.",
      style: "modern",
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "tpl-compact",
      name: "Compact",
      description: "Dense layout for short one-page resumes.",
      style: "compact",
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
  write(TEMPLATES_KEY, items);
  return items;
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function seedUsers(): UserAccount[] {
  const users: UserAccount[] = [
    {
      id: "admin-1",
      email: "admin@jobportal.local",
      username: "admin",
      password: "admin123",
      role: "admin",
      emailVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "officer-1",
      email: "officer@jobportal.local",
      username: "officer",
      password: "officer123",
      role: "officer",
      emailVerified: true,
      fullName: "Placement Officer Demo",
      phone: "03001112233",
      placementCenterId: "center-lahore",
      createdAt: new Date().toISOString(),
    },
    {
      id: "navtcc-1",
      email: "graduate@navtcc.local",
      username: "navtcc_grad",
      password: "navtcc123",
      role: "seeker",
      emailVerified: true,
      seekerProfile: normalizeSeekerProfile({
        fullName: "NAVTCC Graduate",
        fatherName: "Muhammad Ali",
        cnic: "35202-1234567-1",
        phone: "03001234567",
        city: "Lahore",
        gender: "Male",
        dateOfBirth: "2000-05-15",
        address: "Model Town, Lahore",
        careerObjective: "Seeking a technical role in electrical maintenance and industrial safety.",
        profilePicture:
          "https://ui-avatars.com/api/?name=NAVTCC+Graduate&background=2f4d9a&color=fff&size=128",
        cnicFrontPic: "https://placehold.co/400x250/e8eefc/2f4d9a?text=CNIC+Front",
        cnicBackPic: "https://placehold.co/400x250/e8eefc/2f4d9a?text=CNIC+Back",
        education: "DAE Electrical",
        skills: "Wiring, Safety",
        educationItems: [
          {
            id: "edu-seed-1",
            degree: "DAE Electrical",
            institution: "GCT Lahore",
            boardUniversity: "PBTE",
            fieldOfStudy: "Electrical Technology",
            obtainedMarks: "3.2",
            totalMarks: "4.0",
            startDate: "2018-09-01",
            completionDate: "2021-06-30",
            educationLevel: "Diploma / DAE",
          },
        ],
        experienceItems: [
          {
            id: "exp-seed-1",
            jobTitle: "Electrical Apprentice",
            company: "PowerGrid Pvt Ltd",
            employmentType: "Internship",
            location: "Lahore",
            startDate: "2021-07-01",
            endDate: "2022-06-30",
            currentlyWorking: false,
            responsibilities: "Assisted senior technicians with wiring, testing, and safety checks.",
          },
        ],
        skillItems: [
          { id: "skill-seed-1", skillName: "Wiring", skillLevel: "Advanced" },
          { id: "skill-seed-2", skillName: "Safety", skillLevel: "Intermediate" },
        ],
        technicalSkills: "Wiring, Safety, Multimeter testing",
        softSkills: "Teamwork, Communication",
        languages: [
          { id: "lang-seed-1", languageName: "Urdu", proficiency: "Fluent" },
          { id: "lang-seed-2", languageName: "English", proficiency: "Intermediate" },
        ],
      }),
      createdAt: new Date().toISOString(),
    },
    {
      id: "employer-demo",
      email: "employer@jobportal.local",
      username: "employer",
      password: "employer123",
      role: "employer",
      emailVerified: true,
      employerApproval: "approved",
      employerProfile: {
        contactName: "HR Manager",
        phone: "03009876543",
        designation: "HR Lead",
      },
      organization: normalizeOrganization({
        organizationName: "PowerGrid Pvt Ltd",
        category: "Private",
        organizationSize: "51-200",
        industry: "Energy",
        registrationAuthority: "SECP",
        registrationNumber: "PG-2020-001",
        ntn: "1234567-8",
        administrationLevel: "Private / Corporate",
        ministry: "N/A",
        division: "Corporate Affairs",
        adminProvince: "Punjab",
        focalPersonName: "HR Manager",
        focalPersonPhone: "03009876543",
        focalPersonDesignation: "HR Lead",
        country: "Pakistan",
        provinceState: "Punjab",
        district: "Lahore",
        tehsil: "Lahore City",
        address: "Model Town, Lahore",
        about: "Private energy and grid services company.",
        website: "https://example.com",
        faxNumber: "042-111222333",
        vision: "Reliable power for industry and communities.",
        ceoName: "Ali Raza",
        ceoNumber: "03001112222",
        logoUrl:
          "https://ui-avatars.com/api/?name=PowerGrid&background=2563eb&color=fff&size=128&bold=true",
      }),
      createdAt: new Date().toISOString(),
    },
    {
      id: "employer-gov",
      email: "gov@jobportal.local",
      username: "govemployer",
      password: "gov123",
      role: "employer",
      emailVerified: true,
      employerApproval: "approved",
      employerProfile: {
        contactName: "Public Sector HR",
        phone: "0511112222",
        designation: "Director HR",
      },
      organization: normalizeOrganization({
        organizationName: "National Skills Authority",
        category: "Government",
        organizationSize: "201-500",
        industry: "Public Sector",
        registrationAuthority: "Federal Government",
        registrationNumber: "NSA-2015",
        ntn: "9876543-2",
        administrationLevel: "Federal",
        ministry: "Ministry of Federal Education",
        division: "Skills Development",
        adminProvince: "Islamabad Capital Territory",
        focalPersonName: "Public Sector HR",
        focalPersonPhone: "0511112222",
        focalPersonDesignation: "Director HR",
        country: "Pakistan",
        provinceState: "Islamabad Capital Territory",
        district: "Islamabad",
        tehsil: "Islamabad",
        address: "Blue Area, Islamabad",
        about: "Federal skills and training authority.",
        website: "https://gov.example.com",
        faxNumber: "051-111222333",
        vision: "Skilled workforce for national growth.",
        ceoName: "Director General",
        ceoNumber: "0513334444",
        logoUrl:
          "https://ui-avatars.com/api/?name=NSA&background=16a34a&color=fff&size=128&bold=true",
      }),
      createdAt: new Date().toISOString(),
    },
    {
      id: "employer-foreign",
      email: "foreign@jobportal.local",
      username: "foreignemployer",
      password: "foreign123",
      role: "employer",
      emailVerified: true,
      employerApproval: "approved",
      employerProfile: {
        contactName: "Overseas Recruiter",
        phone: "+97150000000",
        designation: "Talent Lead",
      },
      organization: normalizeOrganization({
        organizationName: "GulfTech Overseas",
        category: "Foreign",
        organizationSize: "500+",
        industry: "Oil & Gas",
        registrationAuthority: "Dubai Free Zone",
        registrationNumber: "GT-DXB-88",
        ntn: "FZ-445566",
        administrationLevel: "Other",
        ministry: "N/A",
        division: "Talent Acquisition",
        adminProvince: "Other",
        focalPersonName: "Overseas Recruiter",
        focalPersonPhone: "+97150000000",
        focalPersonDesignation: "Talent Lead",
        country: "UAE",
        provinceState: "Other",
        district: "Dubai",
        tehsil: "Dubai",
        address: "Dubai, UAE",
        about: "Overseas oil and gas recruitment employer.",
        website: "https://foreign.example.com",
        faxNumber: "+971-4-1112222",
        vision: "Connecting Pakistani talent with Gulf opportunities.",
        ceoName: "Talent Director",
        ceoNumber: "+97150000001",
        logoUrl:
          "https://ui-avatars.com/api/?name=GulfTech&background=d97706&color=fff&size=128&bold=true",
      }),
      createdAt: new Date().toISOString(),
    },
  ];
  write(USERS_KEY, users);
  return users;
}

const DEMO_LOGO =
  "https://ui-avatars.com/api/?name=PowerGrid&background=2563eb&color=fff&size=128&bold=true";
const GOV_LOGO =
  "https://ui-avatars.com/api/?name=NSA&background=16a34a&color=fff&size=128&bold=true";
const FOREIGN_LOGO =
  "https://ui-avatars.com/api/?name=GulfTech&background=d97706&color=fff&size=128&bold=true";

function seedJobs(): JobPosting[] {
  const now = new Date().toISOString();
  const jobs: JobPosting[] = [
    {
      id: "job-1",
      title: "Junior Electrician",
      company: "PowerGrid Pvt Ltd",
      companyLogo: DEMO_LOGO,
      category: "Private",
      location: "Lahore",
      type: "Full-time",
      description: "Assist senior electricians with installation and maintenance work.",
      employerId: "employer-demo",
      expiryDate: daysFromNow(30),
      status: "published",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-2",
      title: "IT Support Assistant",
      company: "PowerGrid Pvt Ltd",
      companyLogo: DEMO_LOGO,
      category: "Private",
      location: "Islamabad",
      type: "Contract",
      description: "Provide first-line IT support for office staff.",
      employerId: "employer-demo",
      expiryDate: daysFromNow(14),
      status: "published",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-3",
      title: "Workshop Helper (Expired Demo)",
      company: "PowerGrid Pvt Ltd",
      companyLogo: DEMO_LOGO,
      category: "Private",
      location: "Karachi",
      type: "Part-time",
      description: "This job is expired and cannot accept applications.",
      employerId: "employer-demo",
      expiryDate: daysFromNow(-3),
      status: "expired",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-gov-1",
      title: "Vocational Trainer",
      company: "National Skills Authority",
      companyLogo: GOV_LOGO,
      category: "Government",
      location: "Islamabad",
      type: "Full-time",
      description: "Deliver technical training sessions at government training institutes.",
      employerId: "employer-gov",
      expiryDate: daysFromNow(45),
      status: "published",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-foreign-1",
      title: "Electrical Technician (Overseas)",
      company: "GulfTech Overseas",
      companyLogo: FOREIGN_LOGO,
      category: "Foreign",
      location: "Dubai, UAE",
      type: "Contract",
      description: "Work on industrial electrical systems for an overseas project.",
      employerId: "employer-foreign",
      expiryDate: daysFromNow(60),
      status: "published",
      createdAt: now,
      updatedAt: now,
    },
  ];
  write(JOBS_KEY, jobs);
  return jobs;
}

/** Demo CNICs that already exist in NAVTCC records */
export const NAVTCC_CNICS = new Set(["35202-1234567-1", "61101-7654321-9"]);
