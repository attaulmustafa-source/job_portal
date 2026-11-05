import type { EmployerProfile, OrganizationDetails, SeekerProfile, UserAccount } from "./types";
import { isFullOrganizationComplete } from "./organization";
import { normalizeSeekerProfile } from "./resume";
import type { SeekerProfileSectionId } from "./seeker-profile-sections";
import { NAVTCC_CNICS } from "./storage";

/** Internal = present in NAVTCC trainee/student registry (demo: known CNICs). */
export function isInternalSeeker(profile?: SeekerProfile) {
  const cnic = (profile?.cnic || "").trim();
  return Boolean(cnic) && NAVTCC_CNICS.has(cnic);
}

export function seekerRegistryType(profile?: SeekerProfile): "Internal" | "External" {
  return isInternalSeeker(profile) ? "Internal" : "External";
}

function hasEducation(profile: SeekerProfile) {
  return profile.educationItems.some(
    (e) => e.degree.trim() || e.institution.trim() || e.educationLevel.trim()
  );
}

export function hasSeekerExperience(profile?: SeekerProfile) {
  if (!profile) return false;
  const p = normalizeSeekerProfile(profile);
  return p.experienceItems.some(
    (e) => e.jobTitle.trim() || e.company.trim() || e.currentlyWorking
  );
}

/** Demo: core fields only. Production can require the full profile set. */
export function isBasicProfileComplete(profile?: SeekerProfile) {
  if (!profile) return false;
  const p = normalizeSeekerProfile(profile);
  return Boolean(p.fullName.trim() && p.cnic.trim() && p.phone.trim() && p.city.trim());
}

export function isSeekerSectionComplete(
  section: SeekerProfileSectionId,
  profile?: SeekerProfile
) {
  if (!profile) return false;
  const p = normalizeSeekerProfile(profile);
  switch (section) {
    case "profile":
      return isBasicProfileComplete(p);
    case "qualification":
      return hasEducation(p);
    case "experience":
      return hasSeekerExperience(p);
    case "skills":
      return (
        p.skillItems.some((s) => s.skillName.trim()) ||
        Boolean(p.technicalSkills.trim()) ||
        Boolean(p.softSkills.trim())
      );
    case "certifications":
      return p.certifications.some((c) => c.courseName.trim());
    case "languages":
      return p.languages.some((l) => l.languageName.trim());
    case "projects":
      return p.projects.some((pr) => pr.projectName.trim());
    case "references":
      return p.references.some((r) => r.name.trim());
    default:
      return false;
  }
}

/** Basic Profile + Qualification required. Experience only when a job asks for it. */
export function isSeekerProfileComplete(profile?: SeekerProfile) {
  return isBasicProfileComplete(profile) && isSeekerSectionComplete("qualification", profile);
}

export function canApplyToJob(
  profile: SeekerProfile | undefined,
  job: { experienceRequired?: boolean }
) {
  if (!isSeekerProfileComplete(profile)) {
    return {
      ok: false as const,
      message: "Please complete your profile before applying.",
    };
  }
  if (job.experienceRequired && !hasSeekerExperience(profile)) {
    return {
      ok: false as const,
      message: "This job requires work experience. Add Experience in your profile before applying.",
    };
  }
  return { ok: true as const, message: "" };
}

export function isEmployerProfileComplete(profile?: EmployerProfile) {
  if (!profile) return false;
  return Boolean(profile.contactName.trim() && profile.phone.trim() && profile.designation.trim());
}

export function isOrganizationComplete(org?: OrganizationDetails) {
  return isFullOrganizationComplete(org);
}

export function seekerCompletionPercent(profile?: SeekerProfile) {
  if (!profile) return 0;
  const p = normalizeSeekerProfile(profile);
  const checks = [
    Boolean(p.fullName.trim()),
    Boolean(p.cnic.trim()),
    Boolean(p.phone.trim()),
    Boolean(p.city.trim()),
    Boolean(p.fatherName.trim() || p.dateOfBirth.trim() || p.gender.trim()),
    hasEducation(p),
    hasSeekerExperience(p),
    p.skillItems.some((s) => s.skillName.trim()) || Boolean(p.technicalSkills.trim()),
    p.certifications.some((c) => c.courseName.trim()),
    p.languages.some((l) => l.languageName.trim()),
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export function employerReadyForApproval(user: UserAccount) {
  // Focal person is part of organization profile and syncs into employerProfile on save
  return isOrganizationComplete(user.organization);
}

export function canEmployerPostJobs(user: UserAccount) {
  return user.role === "employer" && user.employerApproval === "approved";
}

export function educationSummary(profile?: SeekerProfile) {
  const p = normalizeSeekerProfile(profile);
  const first = p.educationItems.find((e) => e.degree.trim() || e.institution.trim());
  if (!first) return p.education || "—";
  return [first.degree, first.institution].filter(Boolean).join(" · ") || "—";
}

export function skillsSummary(profile?: SeekerProfile) {
  const p = normalizeSeekerProfile(profile);
  const named = p.skillItems.map((s) => s.skillName.trim()).filter(Boolean);
  if (named.length) return named.join(", ");
  return p.technicalSkills.trim() || p.skills || "—";
}
