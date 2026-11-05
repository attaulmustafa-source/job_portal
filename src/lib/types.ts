export type UserRole = "seeker" | "employer" | "admin" | "officer";

export type EmployerApprovalStatus = "incomplete" | "pending" | "approved" | "rejected";

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected";

export interface EmployerProfile {
  contactName: string;
  phone: string;
  designation: string;
}

export type EmployerCategory = "Government" | "Private" | "Foreign";

export interface OrganizationDetails {
  /** Basic Information */
  organizationName: string;
  /** Organization type: Government / Private / Foreign */
  category: EmployerCategory | "";
  organizationSize: string;
  registrationAuthority: string;
  registrationNumber: string;
  ntn: string;
  administrationLevel: string;
  /** Kept for compatibility / industry label */
  industry: string;
  /** Administrative Status */
  ministry: string;
  division: string;
  adminProvince: string;
  /** Focal Person */
  focalPersonName: string;
  focalPersonPhone: string;
  focalPersonDesignation: string;
  /** Address */
  country: string;
  provinceState: string;
  district: string;
  tehsil: string;
  address: string;
  about: string;
  /** Online / leadership extras */
  website: string;
  faxNumber: string;
  vision: string;
  ceoName: string;
  ceoNumber: string;
  /** Organization logo image URL */
  logoUrl?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  emailVerified: boolean;
  seekerProfile?: SeekerProfile;
  employerProfile?: EmployerProfile;
  organization?: OrganizationDetails;
  employerApproval?: EmployerApprovalStatus;
  /** Placement officer assignment */
  placementCenterId?: string;
  fullName?: string;
  phone?: string;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  /** Snapshot of organization logo at post time */
  companyLogo?: string;
  /** Snapshot of employer org category at post time */
  category: EmployerCategory;
  location: string;
  type: string;
  description: string;
  employerId: string;
  /** When true, seeker must have work experience to apply */
  experienceRequired?: boolean;
  /** Required experience description when experienceRequired is true (e.g. "3+ years") */
  experienceDetails?: string;
  /** ISO date string YYYY-MM-DD */
  expiryDate: string;
  status: "draft" | "published" | "expired" | "unpublished";
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  seekerId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  history: { status: ApplicationStatus; at: string }[];
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export type ResumeTemplateStyle = "classic" | "modern" | "compact";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  style: ResumeTemplateStyle;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeEducationItem {
  id: string;
  degree: string;
  institution: string;
  boardUniversity: string;
  fieldOfStudy: string;
  obtainedMarks: string;
  totalMarks: string;
  startDate: string;
  completionDate: string;
  educationLevel: string;
}

export interface ResumeExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
}

export interface ResumeSkillItem {
  id: string;
  skillName: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "";
}

export interface ResumeCertificationItem {
  id: string;
  courseName: string;
  instituteName: string;
  issueDate: string;
  expiryDate: string;
  certificateId: string;
}

export interface ResumeLanguageItem {
  id: string;
  languageName: string;
  proficiency: "Basic" | "Intermediate" | "Fluent" | "";
}

export interface ResumeProjectItem {
  id: string;
  projectName: string;
  description: string;
  role: string;
  completionDate: string;
  achievements: string;
}

export interface ResumeReferenceItem {
  id: string;
  name: string;
  designation: string;
  organization: string;
  contactNumber: string;
  email: string;
}

export interface ResumeContent {
  /** Personal Information */
  fullName: string;
  profilePicture: string;
  fatherName: string;
  cnic: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  cityDistrict: string;
  careerObjective: string;
  /** Structured sections */
  educationItems: ResumeEducationItem[];
  experienceItems: ResumeExperienceItem[];
  skillItems: ResumeSkillItem[];
  technicalSkills: string;
  softSkills: string;
  certifications: ResumeCertificationItem[];
  languages: ResumeLanguageItem[];
  projects: ResumeProjectItem[];
  references: ResumeReferenceItem[];
}

/** Job seeker career profile — mirrors resume content + CNIC images */
export interface SeekerProfile {
  fullName: string;
  profilePicture: string;
  cnicFrontPic: string;
  cnicBackPic: string;
  fatherName: string;
  cnic: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  careerObjective: string;
  educationItems: ResumeEducationItem[];
  experienceItems: ResumeExperienceItem[];
  skillItems: ResumeSkillItem[];
  technicalSkills: string;
  softSkills: string;
  certifications: ResumeCertificationItem[];
  languages: ResumeLanguageItem[];
  projects: ResumeProjectItem[];
  references: ResumeReferenceItem[];
  /** Legacy flat fields (migrated on load) */
  education?: string;
  skills?: string;
}

export interface SeekerResume {
  id: string;
  seekerId: string;
  templateId: string;
  title: string;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementCenter {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "Pending" | "Approved" | "Rejected" | "Scheduled" | "Completed" | "Cancelled";

export interface CounsellingBooking {
  id: string;
  seekerId: string;
  centerId: string;
  officerId?: string;
  topic: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: BookingStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionStatus = "Scheduled" | "Completed" | "Cancelled";

export interface CounsellingSession {
  id: string;
  bookingId: string;
  seekerId: string;
  officerId: string;
  centerId: string;
  scheduledDate: string;
  scheduledTime: string;
  mode: "In-person" | "Online" | "Phone";
  status: SessionStatus;
  feedback: string;
  outcome: string;
  createdAt: string;
  updatedAt: string;
}
